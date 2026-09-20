import { Exercise } from '../domain';
import { GenerateExerciseRequest } from '../domain/generate-exercise-request';

export interface ExerciseGenerator {
  generate(request: GenerateExerciseRequest): Promise<Exercise>;
}