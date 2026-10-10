import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type {
    CompleteExerciseContent,
    Evaluation as SharedEvaluation,
} from '@percoso/shared';

import { colours } from '../../theme/colours';
import { typography } from '../../theme/typography';
import { ReadingMode } from '../../../types';
import { Switcher } from '../ui/switcher';

interface Props {
    content: CompleteExerciseContent;
    answers: Record<string, string>;
    evaluation: SharedEvaluation;
}

export const CompleteAnswer = ({
    content,
    answers,
    evaluation,
}: Props) => {
    const [readingMode, setReadingMode] =
        useState<ReadingMode>('italian');
    const blankResults = new Map(
        evaluation.blankEvaluations.map(result => [
            result.blankId,
            result,
        ]),
    );

    const correctCount = evaluation.blankEvaluations.filter(
        result => result.correct,
    ).length;

    const percentage = evaluation.blankEvaluations.length
        ? Math.round(
            (correctCount / evaluation.blankEvaluations.length) * 100,
        )
        : 0;

    const incorrectResults = evaluation.blankEvaluations.filter(
        result => !result.correct,
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>YOUR ANSWER</Text>
                <Text style={styles.score}>{percentage}%</Text>
            </View>

            <Switcher<ReadingMode>
                options={[
                    { value: 'italian', label: 'Italian' },
                    { value: 'english', label: 'English' },
                    { value: 'both', label: 'Both' },
                ]}
                value={readingMode}
                onChange={setReadingMode}
            />

            <Text style={styles.instruction}>
                {content.instruction}
            </Text>

            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            {(readingMode === 'italian' || readingMode === 'both') && (
                <Text style={styles.body}>
                    {content.segments.map((segment, index) => {
                        if (segment.type === 'text') {
                            return (
                                <Text key={index}>
                                    {segment.value}
                                </Text>
                            );
                        }

                        const result = blankResults.get(segment.id);

                        if (!result) {
                            return (
                                <Text key={segment.id}>
                                    {answers[segment.id] ?? ''}
                                </Text>
                            );
                        }

                        return (
                            <Text
                                key={segment.id}
                                style={
                                    result.correct
                                        ? styles.correct
                                        : styles.incorrect
                                }
                            >
                                {result.correct
                                    ? answers[segment.id]?.trim()
                                    : result.correctedAnswer}
                            </Text>
                        );
                    })}
                </Text>)}
            {(readingMode === 'english' || readingMode === 'both') && (
                <Text style={styles.translation}>
                    {content.translation}
                </Text>
            )}

            {incorrectResults.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Corrections
                    </Text>

                    {incorrectResults.map(result => {
                        const error = evaluation.detectedErrors.find(
                            item =>
                                item.location?.type === 'complete' &&
                                item.location.blankId === result.blankId,
                        );

                        return (
                            <View
                                key={result.blankId}
                                style={styles.correction}
                            >
                                <Text style={styles.correctionLine}>
                                    <Text style={styles.incorrectOriginal}>
                                        {answers[result.blankId]?.trim() || '—'}
                                    </Text>
                                    <Text style={styles.arrow}> → </Text>
                                    <Text style={styles.correct}>
                                        {result.correctedAnswer}
                                    </Text>
                                </Text>

                                {error && (
                                    <Text style={styles.explanation}>
                                        {error.explanation}
                                    </Text>
                                )}
                            </View>
                        );
                    })}
                </View>
            )}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                    Feedback
                </Text>
                <Text style={styles.feedback}>
                    {evaluation.feedback}
                </Text>
            </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        gap: 24,
    },
    scrollContent: {
        gap: 24,
        paddingBottom: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    label: {
        color: colours.muted,
        fontFamily: typography.medium,
        fontSize: 12,
        letterSpacing: 1,
    },
    score: {
        color: colours.text,
        fontFamily: typography.medium,
        fontSize: 28,
    },
    instruction: {
        color: colours.muted,
        fontFamily: typography.regular,
        fontSize: 15,
        lineHeight: 24,
    },
    body: {
        color: colours.text,
        fontFamily: typography.regular,
        fontSize: 19,
        lineHeight: 38,
    },
    correct: {
        color: '#287A55',
        fontFamily: typography.medium,
    },
    incorrect: {
        color: '#B34F4F',
        fontFamily: typography.medium,
    },
    section: {
        gap: 12,
    },
    sectionTitle: {
        color: colours.text,
        fontFamily: typography.medium,
        fontSize: 15,
    },
    correction: {
        gap: 4,
    },
    correctionLine: {
        fontFamily: typography.regular,
        fontSize: 17,
    },
    incorrectOriginal: {
        color: '#B34F4F',
        textDecorationLine: 'line-through',
    },
    arrow: {
        color: colours.muted,
    },
    explanation: {
        color: colours.muted,
        fontFamily: typography.regular,
        fontSize: 14,
        lineHeight: 22,
    },
    feedback: {
        color: colours.muted,
        fontFamily: typography.regular,
        fontSize: 15,
        lineHeight: 24,
    },
    translation: {
        color: colours.text,
        fontFamily: typography.regular,
        fontSize: 19,
        lineHeight: 38,
    },
});
