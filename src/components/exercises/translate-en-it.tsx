
import { StyleSheet, Text, TextInput, View } from 'react-native';

import type {
    TranslateEnItExerciseContent,
} from '@percoso/shared';

import { colours } from '../../theme/colours';
import { typography } from '../../theme/typography';

interface Props {
    content: TranslateEnItExerciseContent;
    answer: string;
    onAnswerChange: (answer: string) => void;
}

export const TranslateEnItExercise = ({
    content,
    answer,
    onAnswerChange,
}: Props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.instruction}>
                {content.instruction}
            </Text>

            <Text style={styles.sourceText}>
                {content.text}
            </Text>

            <Text style={styles.label}>
                YOUR TRANSLATION
            </Text>

            <TextInput
                style={styles.input}
                value={answer}
                onChangeText={onAnswerChange}
                placeholder="Write in Italian..."
                placeholderTextColor={colours.muted}
                multiline
                textAlignVertical="top"
                autoCorrect={false}
                autoCapitalize="sentences"
                accessibilityLabel="Your Italian translation"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 24,
    },
    instruction: {
        color: colours.muted,
        fontFamily: typography.regular,
        fontSize: 15,
        lineHeight: 24,
    },
    sourceText: {
        color: colours.text,
        fontFamily: typography.regular,
        fontSize: 19,
        lineHeight: 38,
    },
    label: {
        color: colours.muted,
        fontFamily: typography.medium,
        fontSize: 12,
        letterSpacing: 1,
    },
    input: {
        color: colours.text,
        fontFamily: typography.regular,
        fontSize: 19,
        lineHeight: 32,
        minHeight: 140,
        paddingVertical: 12,
        paddingHorizontal: 0,
    },
});
