export const singleWordBlankPrompt = `
Every blank must require exactly one Italian word.

Rules:
- Test one specific grammatical or vocabulary decision per blank.
- Provide enough surrounding context to identify the intended answer.
- Avoid blanks with multiple substantially different valid answers.
- For compound verb forms, provide the other words outside the blank.
- For reflexive constructions, provide the pronoun and auxiliary
  outside the blank when testing the past participle.
- Do not create blanks requiring entire phrases or sentences.
- Every acceptedAnswer must contain exactly one word.
`;