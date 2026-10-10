import { z } from 'zod';

export const completeContentSchema = z.object({
  instruction: z.string(),
  segments: z.array(
    z.discriminatedUnion('type', [
      z.object({
        type: z.literal('text'),
        value: z.string(),
      }),
      z.object({
        type: z.literal('blank'),
        id: z.string(),
      }),
    ]),
  ),
  answers: z.array(
    z.object({
      blankId: z.string(),
      acceptedAnswers: z.array(z.string()),
    }),
  ),
  translation: z.string(),
});

export type CompleteExerciseContent =
  z.infer<typeof completeContentSchema>;