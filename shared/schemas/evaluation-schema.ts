import { z } from 'zod';

export const learnerErrorCategorySchema = z.enum([
    'grammar',
    'vocabulary',
    'spelling',
    'word_order',
    'article',
    'preposition',
    'verb_form',
    'tense',
    'agreement',
    'pronoun',
    'collocation',
    'register',
    'punctuation',
    'other',
]);

const textRangeSchema = z.object({
    start: z.number().int().min(0),
    end: z.number().int().min(0),
});

const completeErrorLocationSchema = z.object({
    type: z.literal('complete'),
    blankId: z.string(),
    range: textRangeSchema.nullable(),
});

const detectedErrorSchema = z.object({
    id: z.string(),
    errorType: z.string(),
    competencyId: z.string().nullable(),
    category: learnerErrorCategorySchema,

    range: textRangeSchema.nullable(),

    learnerForm: z.string(),
    correctedForm: z.string(),
    explanation: z.string(),
});

const baseEvaluationSchema = z.object({
    score: z.number().min(-1).max(1),

    feedback: z.string(),

    competencyEvaluations: z.array(
        z.object({
            competencyId: z.string(),
            score: z.number().min(-1).max(1),
        }),
    ),
});

export const translateEnItEvaluationSchema =
    baseEvaluationSchema.extend({
        sectionEvaluations: z.array(
            z.object({
                sourceText: z.string(),
                correct: z.boolean(),
                learnerText: z.string(),
                correctedText: z.string(),
            }),
        ),

        correctedTranslation: z.string(),

        detectedErrors: z.array(
            detectedErrorSchema.extend({
                location: z.null(),
            }),
        ),
    });

export const completeEvaluationSchema = baseEvaluationSchema.extend({
    blankEvaluations: z.array(
        z.object({
            blankId: z.string(),
            correct: z.boolean(),
            correctedAnswer: z.string(),
        }),
    ),

    detectedErrors: z.array(
        detectedErrorSchema.extend({
            location: completeErrorLocationSchema.nullable(),
        }),
    ),
});

export type CompleteEvaluation = z.infer<
    typeof completeEvaluationSchema
>;

export type TranslateEnItEvaluation = z.infer<
    typeof translateEnItEvaluationSchema
>;

export type LearnerErrorCategory = z.infer<
    typeof learnerErrorCategorySchema
>;