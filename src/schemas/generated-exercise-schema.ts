import { z } from 'zod';

export const generatedExerciseSchema = z.object({
  prompt: z.string(),
  referenceAnswers: z.array(z.string()),
});