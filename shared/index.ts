export {
    generatedExerciseSchema,
} from './schemas/generated-exercise-schema';

// Complete exercise
export {
    completeContentSchema,
} from './schemas/complete-content-schema';

export type {
    CompleteExerciseContent,
} from './schemas/complete-content-schema';

export type {
    CompleteAnswer,
} from './domain/exercises/complete-answer';

// English → Italian translation exercise
export {
    translateEnItContentSchema,
} from './schemas/translate-en-it-content-schema';

export type {
    TranslateEnItExerciseContent,
} from './schemas/translate-en-it-content-schema';

export type {
    TranslateEnItAnswer,
} from './domain/exercises/translate-en-it-answer';

// Exercise evaluation
export {
    completeEvaluationSchema,
    translateEnItEvaluationSchema,
    learnerErrorCategorySchema,
} from './schemas/evaluation-schema';

export type {
    CompleteEvaluation,
    TranslateEnItEvaluation,
    LearnerErrorCategory,
} from './schemas/evaluation-schema';