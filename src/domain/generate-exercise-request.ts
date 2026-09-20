import { ExerciseDifficulty, CefrLevel, ExerciseType } from '../../types';

export interface GenerateExerciseRequest {
  level: CefrLevel;
  type: ExerciseType;
  difficulty: ExerciseDifficulty;
  competencyIds: string[];
}