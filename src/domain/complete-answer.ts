import { CompleteExerciseContent } from "@percoso/shared";
import type {
    CompleteEvaluation
} from '@percoso/shared';

interface Props {
    content: CompleteExerciseContent;
    answers: Record<string, string>;
    evaluation: CompleteEvaluation;
}