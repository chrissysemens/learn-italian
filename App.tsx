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
import { MockExerciseGenerator } from './src/services/exercise/mock-exercise-generator';
import { LearningService } from './src/services/learning/learning-service';
import { getCompetencies } from './src/curriculum/curriculum';
import { buildCompetencyCandidates } from './src/services/learning/build-competency-candiates';
import { selectCompetency } from './src/services/learning/select-competency';

const learnerRepo = new FSLearnerRepo();
const learnerErrorRepo = new FsLearnerErrorRepo();
const competencyProgressRepo =
    new FsCompetencyProgressRepo();


const learningService = new LearningService(
    new MockExerciseGenerator(),
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
            const competencies = getCompetencies('A1');

            const progress =
                await competencyProgressRepo.getByLearner(
                    env.learnerId,
                );

            console.log('PROGRESS', progress);

            const learnerErrors =
                await learnerErrorRepo.getByLearner(
                    env.learnerId,
                );

            const candidates = buildCompetencyCandidates(
                competencies,
                progress,
                learnerErrors,
            );

            console.log('CANDIDATES', candidates);

            const competencyId =
                selectCompetency(candidates);

            console.log('SELECTED COMPETENCY', competencyId);
            const exercise = await learningService.generateExercise(
                'A1',
                'translate_en_it',
                'standard',
                [competencyId],
            );

            console.log('EXERCISE', exercise);

            const evaluation = await learningService.evaluateAnswer(
                env.learnerId,
                exercise,
                'Cosa fai sabato?',
            );

            console.log('EVALUATION', evaluation);
        } catch (error) {
            console.error(error);
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