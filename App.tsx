import React, { useEffect, useState } from 'react';
import {
    Button,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { FsLearnerErrorRepo } from './src/data/firestore/fs-learner-error-repo';
import { FSLearnerRepo } from './src/data/firestore/fs-learner-repo';
import { FsCompetencyProgressRepo } from './src/data/firestore/fs-comptency-progress-repo';
import { CompetencyProgress } from './src/domain';
import { Learner } from './src/domain/learner';
import { env } from './src/config/env';
import { MockAnswerEvaluator } from './src/services/exercise/mock-answer-evaluator';
//import { MockExerciseGenerator } from './src/services/exercise/mock-exercise-generator';
import { LearningService } from './src/services/learning/learning-service';
import { getCompetencies, getTopics } from './src/curriculum/curriculum';
import { buildCompetencyCandidates } from './src/services/learning/build-competency-candiates';
import { selectCompetency } from './src/services/learning/select-competency';
import { buildDifficultyCandidates } from './src/services/learning/build-difficulty-candidates';
import { selectDifficulty } from './src/services/learning/select-difficulty';
import { selectExerciseType } from './src/services/learning/select-exercise-type';
import { selectTopic } from './src/services/learning/select-topic';
import { LessonService } from './src/services/lesson/lesson-service';
import { MockLessonGenerator } from './src/services/lesson/mock-lesson-generator';
import { FsLessonRepo } from './src/data/firestore/fs-lesson-repo';
import { OpenAIExerciseGenerator } from './src/services/exercise/open-ai-exercise-geenerator';
import { httpsCallable } from 'firebase/functions';
import { functions } from './src/config/firebase';

const learnerRepo = new FSLearnerRepo();
const learnerErrorRepo = new FsLearnerErrorRepo();
const competencyProgressRepo =
    new FsCompetencyProgressRepo();


const learningService = new LearningService(
    new OpenAIExerciseGenerator(),
    new MockAnswerEvaluator(),
    competencyProgressRepo,
    learnerErrorRepo,
);

export default function App() {
    const [learner, setLearner] = useState<Learner | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);


    useEffect(() => {
        const loadLearner = async () => {
            try {
                if (!env.learnerId) {
                    throw new Error(
                        'EXPO_PUBLIC_LEARNER_ID is not configured.',
                    );
                }

                setLearner(
                    await learnerRepo.get(env.learnerId),
                );
            } catch (loadError) {
                setError(
                    loadError instanceof Error
                        ? loadError
                        : new Error('Unable to load learner.'),
                );
            } finally {
                setLoading(false);
            }
        };

        loadLearner();
    }, []);

    const runExercise = async () => {
        try {
            const generateExercise =
                httpsCallable(
                    functions,
                    'generateExercise',
                );

            const result =
                await generateExercise({
                    hello: 'Percoso',
                });

            console.log(
                'FUNCTION RESULT',
                result.data,
            );

            const competencies = getCompetencies('A1');

            const progress =
                await competencyProgressRepo.getByLearner(
                    env.learnerId,
                );

            const learnerErrors =
                await learnerErrorRepo.getByLearner(
                    env.learnerId,
                );

            const candidates = buildCompetencyCandidates(
                competencies,
                progress,
                learnerErrors,
            );

            const competencyId =
                selectCompetency(candidates);

            const competency = competencies.find(
                c => c.id === competencyId,
            );


            if (!competency) {
                throw new Error(
                    `Competency not found: ${competencyId}`,
                );
            }

            console.log('SELECTED COMPETENCY', competencyId);

            const selectedProgress = progress.find(
                item => item.competencyId === competencyId,
            );

            console.log('PROGRESS', progress);

            console.log(
                'SELECTED PROGRESS',
                selectedProgress,
            );

            const difficultyCandidates =
                buildDifficultyCandidates(selectedProgress);

            const difficulty =
                selectDifficulty(difficultyCandidates);

            console.log(
                'SELECTED DIFFICULTY',
                difficulty,
            );


            const exerciseType = selectExerciseType();

            console.log(
                'SELECTED EXERCISE TYPE',
                exerciseType,
            );

            const topics = getTopics('A1');

            const topic = selectTopic(topics);

            console.log(
                'SELECTED TOPIC',
                topic,
            );

            const exercise = await learningService.generateExercise(
                'A1',
                exerciseType,
                difficulty,
                {
                    topic,
                    competencies: competencies.filter(c => c.id === competencyId),
                },
            );

            console.log('EXERCISE', exercise);

            const skip = false;

            if (skip) {
                console.log('SKIPPED');
                return;
            }


            const lessonService = new LessonService(
                new MockLessonGenerator(),
                new FsLessonRepo());

            const lesson = await lessonService.createLesson(
                env.learnerId,
                exercise,
                [competency],
                topic,
            );

            console.log('LESSON', lesson);

            if (exercise.type === 'review') {
                return;
            }

            const assisted = false;

            console.log('ASSISTED', assisted);

            const evaluation = await learningService.evaluateAnswer(
                env.learnerId,
                exercise,
                'Cosa fai sabato?',
                assisted
            );

            if (assisted) {
                console.log('ASSISTED — skipping learner state updates');
                return evaluation;
            }

            console.log('EVALUATION', evaluation);


        } catch (error) {
            console.error('FUNCTION ERROR', error);

            if (error instanceof Error) {
                console.error('MESSAGE', error.message);
                console.error('STACK', error.stack);
            }

            console.log(
                'RAW ERROR',
                JSON.stringify(error, null, 2),
            );
        }
    };

    const progress: CompetencyProgress = {
        competencyId: 'a1-present-fare',
        mastery: 0.5,
        confidence: 0,
        attempts: 4,
    };


    return (
        <View style={styles.container}>
            {loading && <Text>Loading learner...</Text>}

            {error && (
                <Text>
                    Unable to load learner: {error.message}
                </Text>
            )}

            {!loading && !error && !learner && (
                <Text>
                    No learner found for the configured document ID.
                </Text>
            )}

            {learner && (
                <>
                    <Text>
                        Ciao {learner.firstName}! Level: {learner.currentLevel}
                    </Text>

                    <Button
                        title="Run exercise"
                        onPress={runExercise}
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
});