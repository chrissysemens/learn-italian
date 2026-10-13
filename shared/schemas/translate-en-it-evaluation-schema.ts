
import { z } from 'zod';

import {
    learnerErrorCategorySchema,
} from './evaluation-schema';

const textRangeSchema = z.object({
    start: z.number().int().min(0),
    end: z.number().int().min(0),
});

export const translateEnItEvaluationSchema = z.object({
    score: z.number().min(-1).max(1),

    feedback: z.string(),

    competencyEvaluations: z.array(
        z.object({
            competencyId: z.string(),
            score: z.number().min(-1).max(1),
        }),
    ),

    correctedTranslation: z.string(),

    detectedErrors: z.array(
        z.object({
            id: z.string(),
            errorType: z.string(),
            competencyId: z.string().nullable(),
            category: learnerErrorCategorySchema,

            range: textRangeSchema.nullable(),

            location: z.object({
                type: z.literal('translate_en_it'),
                range: textRangeSchema.nullable(),
            }).nullable(),

            learnerForm: z.string(),
            correctedForm: z.string(),
            explanation: z.string(),
        }),
    ),
});

export type TranslateEnItEvaluation =
    z.infer<typeof translateEnItEvaluationSchema>;
