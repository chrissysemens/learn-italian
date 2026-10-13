import { z } from 'zod';

export const translateEnItContentSchema = z.object({
    instruction: z.string(),
    text: z.string(),
    translation: z.string(),
});

export type TranslateEnItExerciseContent =
    z.infer<typeof translateEnItContentSchema>;