
export const translateEnItExercisePrompt = `
    Generate an English-to-Italian translation exercise.

    The learner will be shown English text and must translate it into Italian.

    Requirements:
    - Follow the requested CEFR level, competency, difficulty and topic.
    - Generate natural, meaningful English appropriate to the learner.
    - Ensure the Italian translation is grammatically correct and idiomatic.
    - Make the exercise focus on the requested competency.
    - Avoid unnecessary linguistic complexity.
    - Prefer realistic everyday situations.
    - Use natural British English.

    Return:
    - instruction: A short instruction in English.
    - text: The English text the learner must translate.
    - translation: One natural, correct Italian translation.

    The translation is a reference answer, not the only acceptable answer.
    Other grammatically correct translations may also be valid.
    `;
