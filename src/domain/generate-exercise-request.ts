import { ExerciseDifficulty, CefrLevel, ExerciseType } from '../../types';
import { ExerciseGenerationContext } from './exercise-generation-context';

export interface GenerateExerciseRequest {
  level: CefrLevel;
  type: ExerciseType;
  difficulty: ExerciseDifficulty;
  context: ExerciseGenerationContext;
}