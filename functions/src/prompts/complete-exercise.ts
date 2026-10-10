export const completeExercisePrompt = `
    Generate a fill-in-the-blank exercise.

    The learner must complete missing words or short phrases
    within Italian sentences or dialogues.

    Do not generate translation tasks, even if the answers
    could be entered into blanks.

    Represent the exercise as ordered text and blank segments.

    For dialogues, use natural line breaks to separate speakers
    and distinct utterances.

    Avoid presenting multiple dialogue turns as one continuous paragraph.

    Give every blank a unique ID.
    Include exactly one answer entry for each blank.
    Each accepted answer must fit grammatically into its blank.

    Preserve spaces, punctuation, and line breaks in text segments.
    Never include the correct answers in the instruction.

    - Include an English translation of the complete exercise text.
    - Translate the Italian sentences as they read with all blanks
    filled using the intended correct answers.
    - Preserve paragraph and dialogue breaks.
    - Use natural British English.
    - Do not include blanks or answer placeholders in the translation.
    - The translation must correspond exactly in meaning to the
    completed Italian text.
`.trim();