import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type {
  CompleteExerciseContent,
} from '@percoso/shared';

import { colours } from '../../theme/colours';
import { typography } from '../../theme/typography';

type CompleteAnswers = Record<string, string>;

interface Props {
  content: Pick<
    CompleteExerciseContent,
    'instruction' | 'segments'
  >;
  onChange: (answers: CompleteAnswers) => void;
  onSubmit: (answers: CompleteAnswers) => void;
}

export const CompleteExercise = ({
  content,
  onChange,
  onSubmit,
}: Props) => {
  const [answers, setAnswers] =
    useState<CompleteAnswers>({});
  const opacity = useRef(new Animated.Value(0)).current;
  const inputs = useRef<Record<string, TextInput | null>>({});
  const firstBlankId = content.segments.find(segment => segment.type !== 'text')?.id;
  const [instructionLength, setInstructionLength] = useState(0);
  const instructionCharacters = Array.from(content.instruction);
  const instructionComplete = instructionLength >= instructionCharacters.length;

  useEffect(() => {
    setInstructionLength(0);
    opacity.setValue(0);
    const characterCount = Array.from(content.instruction).length;
    let revealed = 0;
    const timer = setInterval(() => {
      revealed += 1;
      setInstructionLength(revealed);
      if (revealed >= characterCount) clearInterval(timer);
    }, 30);

    return () => clearInterval(timer);
  }, [content.instruction, opacity]);

  useEffect(() => {
    if (!instructionComplete) return;

    const animation = Animated.timing(opacity, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });

    let active = true;
    animation.start(({ finished }) => {
      if (active && finished && firstBlankId) inputs.current[firstBlankId]?.focus();
    });
    return () => {
      active = false;
      animation.stop();
    };
  }, [instructionComplete, opacity, firstBlankId]);

  const updateAnswer = (
    id: string,
    value: string,
  ) => {
    const updated = {
      ...answers,
      [id]: value,
    };

    setAnswers(updated);
    onChange(updated);
  };

  return (
    <View style={styles.container}>
      <View style={styles.instructionContainer}>
        <Text style={[styles.instruction, styles.hidden]} accessible={false}>
          {content.instruction}
        </Text>
        <Text
          style={[styles.instruction, styles.typedInstruction]}
          accessibilityLabel={content.instruction}
        >
          {instructionCharacters.slice(0, instructionLength).join('')}
        </Text>
      </View>

      <Animated.View
        style={{ opacity, flex: 1 }}
        pointerEvents={instructionComplete ? 'auto' : 'none'}
        accessibilityElementsHidden={!instructionComplete}
        importantForAccessibility={instructionComplete ? 'auto' : 'no-hide-descendants'}
      >
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
      <Text style={styles.body}>
        {content.segments.map((segment, index) => {
          if (segment.type === 'text') {
            return (
              <Text key={index}>
                {segment.value}
              </Text>
            );
          }

          return (
            <TextInput
              key={segment.id}
              ref={input => { inputs.current[segment.id] = input; }}
              value={answers[segment.id] ?? ''}
              onChangeText={value =>
                updateAnswer(segment.id, value)
              }
              style={[
                styles.blank,
                { width: 100 + segment.id.length * 10 },
              ]}
              autoCapitalize="none"
              returnKeyType="done"
              submitBehavior="blurAndSubmit"
              enablesReturnKeyAutomatically={false}
              onSubmitEditing={event => {
                const updated = { ...answers, [segment.id]: event.nativeEvent.text };
                setAnswers(updated);
                onChange(updated);
                const blanks = content.segments.filter(item => item.type !== 'text');
                const missing = blanks.find(blank => !updated[blank.id]?.trim());
                if (missing) {
                  Keyboard.dismiss();
                } else if (blanks.length > 0) {
                  onSubmit(updated);
                }
              }}
              editable={instructionComplete}
              autoCorrect={false}
              underlineColorAndroid="transparent"
              accessibilityLabel={`Blank ${segment.id}`}
            />
          );
        })}
      </Text>
      </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  hidden: {
    opacity: 0,
  },
  instructionContainer: {
    marginBottom: 32,
  },
  typedInstruction: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  container: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 16,
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

  blank: {
    height: 38,
    color: colours.text,
    fontFamily: typography.medium,
    fontSize: 19,
    paddingVertical: 0,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colours.muted,
    textAlign: 'center',
  },
});
