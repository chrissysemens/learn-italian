import { CompleteExerciseContent } from "@percoso/shared";
import type {
    Evaluation as SharedEvaluation,
} from '@percoso/shared';

interface Props {
    content: CompleteExerciseContent;
    answers: Record<string, string>;
    evaluation: SharedEvaluation;
}