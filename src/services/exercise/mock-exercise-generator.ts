import { Exercise } from '../../domain';
import { ExerciseGenerator } from '../../interfaces/exercise-generator';
import { GenerateExerciseRequest } from '../../domain/generate-exercise-request';

export class MockExerciseGenerator implements ExerciseGenerator {
  async generate(
    request: GenerateExerciseRequest,
  ): Promise<Exercise> {

    console.log(
      'GENERATION CONTEXT',
      request.context,
    );
    return {
      id: 'mock-exercise-1',
      type: request.type,
      level: request.level,
      difficulty: request.difficulty,
      prompt: 'Translate into Italian: What do you do on Saturday?',
      referenceAnswers: ['Cosa fai sabato?'],
      vocabularyIds: [],
      competencyIds: request.context.competencies.map((c) => c.id),
      topicId: request.context.topic.id,
    };
  }
}