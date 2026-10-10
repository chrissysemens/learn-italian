import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colours } from '../../theme/colours';
import { typography } from '../../theme/typography';

interface Props<T extends string> {
    options: readonly { value: T; label: string }[];
    value: T;
    onChange: (value: T) => void;
}

export const Switcher = <T extends string,>({ options, value, onChange }: Props<T>) => (
    <View style={styles.container}>
        {options.map(option => (
            <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected: value === option.value }}
                onPress={() => onChange(option.value)}
                style={[styles.option, value === option.value && styles.optionActive]}
            >
                <Text style={[styles.label, value === option.value && styles.labelActive]}>
                    {option.label}
                </Text>
            </Pressable>
        ))}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        backgroundColor: '#F0F0ED',
        borderRadius: 12,
        padding: 4,
    },

    option: {
        minWidth: 84,
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },

    optionActive: {
        backgroundColor: '#FFFFFF',
    },

    label: {
        color: colours.muted,
        fontFamily: typography.regular,
        fontSize: 14,
    },

    labelActive: {
        color: colours.text,
        fontFamily: typography.medium,
    },
});
