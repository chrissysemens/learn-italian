import { ExerciseDifficulty } from '../../../types';
import { CefrLevel, ExerciseType } from '../../domain';

export interface GenerateExerciseRequest {
  level: CefrLevel;
  type: ExerciseType;
  difficulty: ExerciseDifficulty;
  competencyIds: string[];
}