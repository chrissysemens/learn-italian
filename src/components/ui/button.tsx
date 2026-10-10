import { Pressable, StyleSheet, Text } from 'react-native';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

import { colours } from '../../theme/colours';
import { typography } from '../../theme/typography';

interface Props {
  title: string;
  onPress: PressableProps['onPress'];
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Button = ({ title, onPress, disabled = false, style }: Props) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{ disabled }}
    disabled={disabled}
    onPress={onPress}
    style={({ pressed }) => [
      styles.button,
      style,
      pressed && styles.pressed,
      disabled && styles.disabled,
    ]}
  >
    <Text style={[styles.label, disabled && styles.disabledLabel]}>
      {title}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    minWidth: 112,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: colours.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    backgroundColor: colours.buttonPressed,
  },
  disabled: {
    backgroundColor: colours.buttonDisabled,
  },
  label: {
    color: colours.text,
    fontFamily: typography.medium,
    fontSize: 16,
    lineHeight: 24,
  },
  disabledLabel: {
    color: colours.buttonDisabledText,
  },
});
