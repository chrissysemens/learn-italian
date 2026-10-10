import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    Animated,
    Keyboard,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Learner, Exercise } from '../../domain';
import { getCompetencies, getTopics } from '../../curriculum/curriculum';
import { FsCompetencyProgressRepo } from '../../data/firestore/fs-comptency-progress-repo';
import { FsLearnerErrorRepo } from '../../data/firestore/fs-learner-error-repo';
import { buildCompetencyCandidates } from '../../services/learning/build-competency-candiates';
import { selectCompetency } from '../../services/learning/select-competency';
import { buildDifficultyCandidates } from '../../services/learning/build-difficulty-candidates';
import { selectDifficulty } from '../../services/learning/select-difficulty';
import { selectTopic } from '../../services/learning/select-topic';
import { learningService } from '../../services/learning/learning-service-instance';
import { colours } from '../../theme/colours';
import { typography } from '../../theme/typography';
import { Screen } from '../../components/screen';
import { CompleteExercise } from '../../components/exercises/complete';
import { Button } from '../../components/ui/button';
import { Loading } from '../../components/loading';
import { FirebaseExerciseEvaluator } from '../../services/exercise/firebase-exercise-evaluator';
import type {
    Evaluation as SharedEvaluation,
} from '@percoso/shared';
import { CompleteAnswer } from '../../components/exercises/complete-answer';


interface Props {
    learner: Learner;
}

const progressRepo = new FsCompetencyProgressRepo();
const errorRepo = new FsLearnerErrorRepo();

export const HomeScreen = ({ learner }: Props) => {
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [answers, setAnswers] =
        useState<Record<string, string>>({});
    const generationInProgress = useRef(false);
    const [submitting, setSubmitting] = useState(false);
    const submissionInProgress = useRef(false);
    const exerciseOpacity = useRef(new Animated.Value(1)).current;
    const [transitioning, setTransitioning] = useState(false);
    const [exerciseRevision, setExerciseRevision] = useState(0);
    const [evaluation, setEvaluation] =
        useState<SharedEvaluation | null>(null);

    useLayoutEffect(() => {
        exerciseOpacity.setValue(1);
    }, [exerciseRevision, exerciseOpacity]);

    const generateExercise = useCallback(async () => {
        if (generationInProgress.current) {
            return;
        }

        generationInProgress.current = true;
        setGenerating(true);
        setError(null);

        try {
            const competencies = getCompetencies(learner.currentLevel);
            const topics = getTopics(learner.currentLevel);

            const [progress, learnerErrors] = await Promise.all([
                progressRepo.getByLearner(learner.id),
                errorRepo.getByLearner(learner.id),
            ]);

            const candidates = buildCompetencyCandidates(
                competencies,
                progress,
                learnerErrors,
            );

            const competencyId = selectCompetency(candidates);
            const competency = competencies.find(
                item => item.id === competencyId,
            );

            if (!competency || topics.length === 0) {
                throw new Error('No curriculum available.');
            }

            const selectedProgress = progress.find(
                item => item.competencyId === competencyId,
            );

            const difficulty = selectDifficulty(
                buildDifficultyCandidates(selectedProgress),
            );

            const generated = await learningService.generateExercise(
                learner.currentLevel,
                'complete',
                difficulty,
                {
                    competencies: [competency],
                    topic: selectTopic(topics),
                },
            );

            setAnswers({});
            setEvaluation(null);
            setExerciseRevision(revision => revision + 1);
            setExercise(generated);
        } catch (err) {
            exerciseOpacity.setValue(1);
            console.error('Exercise generation failed', err);
            setError('Unable to generate an exercise.');
        } finally {
            generationInProgress.current = false;
            setGenerating(false);
        }
    }, [learner.id, learner.currentLevel, exerciseOpacity]);

    useEffect(() => {
        void generateExercise();
    }, [generateExercise]);

    const submitAnswer = async (submittedAnswers: Record<string, string>) => {
        if (!exercise?.completeContent || evaluation || submissionInProgress.current || submitting || transitioning || generating) {
            return;
        }
        const blanks = exercise.completeContent.segments.filter(segment => segment.type !== 'text');
        if (!blanks.length || !blanks.every(blank => submittedAnswers[blank.id]?.trim())) return;

        submissionInProgress.current = true;
        setAnswers(submittedAnswers);
        setSubmitting(true);
        setError(null);
        setTransitioning(true);
        Keyboard.dismiss();

        try {
            console.log('SUBMITTING FOR EVALUATION');

            const evaluator = new FirebaseExerciseEvaluator();

            const evaluation = await evaluator.evaluate(
                exercise,
                {
                    type: 'complete',
                    values: submittedAnswers,
                },
            );

            console.log(
                'EVALUATION RESULT',
                JSON.stringify(evaluation, null, 2),
            );

            setEvaluation(evaluation);

            /*await new Promise<void>(resolve => {
                Animated.timing(exerciseOpacity, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }).start(() => resolve());
            });*/

        } catch (error) {
            console.error('EVALUATION FAILED', error);
            setError('Unable to evaluate your answers. Press Done to try again.');
        } finally {
            submissionInProgress.current = false;
            setSubmitting(false);
            setTransitioning(false);
        }
    };

    const nextExercise = async () => {
        if (!exercise?.completeContent || !evaluation || generationInProgress.current || transitioning) return;

        setTransitioning(true);
        Keyboard.dismiss();
        try {
            await new Promise<void>(resolve => {
                Animated.timing(exerciseOpacity, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                }).start(() => resolve());
            });
            await generateExercise();
        } finally {
            setTransitioning(false);
        }
    };

    if (generating || (!exercise && !error)) {
        return <Loading text="Preparing your exercise..." />;
    }

    return (
        <Screen>
            <View style={styles.content}>
                {exercise?.type === 'complete' &&
                    exercise.completeContent && (
                        <Animated.View
                            key={exerciseRevision}
                            style={{ opacity: exerciseOpacity, flex: 1 }}
                            pointerEvents={transitioning ? 'none' : 'auto'}
                        >
                            {evaluation ? (
                                <CompleteAnswer
                                    content={exercise.completeContent}
                                    answers={answers}
                                    evaluation={evaluation}
                                />
                            ) : (
                                <CompleteExercise
                                    key={`${exercise.id}-${exerciseRevision}`}
                                    content={exercise.completeContent}
                                    onChange={setAnswers}
                                    onSubmit={submitAnswer}
                                />
                            )}
                        </Animated.View>
                    )}
                {error && (
                    <Text style={styles.error}>{error}</Text>
                )}

            </View>
            <View style={styles.actions}>
                {exercise?.completeContent && !evaluation && (
                    <Button
                        title={submitting ? 'Evaluating...' : 'Submit'}
                        onPress={() => submitAnswer(answers)}
                        disabled={submitting || transitioning || !exercise.completeContent.segments
                            .filter(segment => segment.type !== 'text')
                            .every(blank => answers[blank.id]?.trim())}
                        style={styles.submit}
                    />
                )}
                {exercise?.completeContent && evaluation && (
                <Button
                    title="Next"
                    onPress={nextExercise}
                    disabled={generating || transitioning}
                    style={styles.submit}
                />
                )}
                {error && !exercise && (
                    <Button title="Retry" onPress={generateExercise} disabled={generating} />
                )}
            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    submit: {
        minWidth: 160,
    },
    actions: {
        flexShrink: 0,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 24,
    },

    prompt: {
        color: colours.text,
        fontFamily: typography.regular,
        fontSize: 20,
        lineHeight: 32,
        marginBottom: 32,
    },

    error: {
        color: colours.text,
        fontFamily: typography.regular,
        marginBottom: 16,
    },
});
