import { ExerciseDifficulty, CefrLevel, ExerciseType } from '../../types';
import type {
  CompleteExerciseContent,
} from '@percoso/shared';



export interface Exercise {
  id: string;
  type: ExerciseType;
  level: CefrLevel;
  difficulty: ExerciseDifficulty;
  prompt: string;
  referenceAnswers: string[];
  competencyIds: string[];
  vocabularyIds: string[];
  topicId?: string;
  completeContent?: CompleteExerciseContent;
}