import { Exercise } from '../../domain';
import { GenerateExerciseRequest } from './generate-exercise-request';

export interface ExerciseGenerator {
  generate(request: GenerateExerciseRequest): Promise<Exercise>;
}