import {
    Exercise,
    GenerateExerciseRequest,
} from '../../domain';

import {
    ExerciseGenerator,
} from '../../interfaces';

export class OpenAIExerciseGenerator
    implements ExerciseGenerator {

    async generate(
        request: GenerateExerciseRequest,
    ): Promise<Exercise> {
        const input = {
            level: request.level,
            type: request.type,
            difficulty: request.difficulty,
            competencies:
                request.context.competencies.map(
                    competency => ({
                        id: competency.id,
                        name: competency.name,
                        description: competency.description,
                    }),
                ),
            topic: {
                id: request.context.topic.id,
                name: request.context.topic.name,
            },
        };

        console.log(
            'OPENAI EXERCISE INPUT',
            JSON.stringify(input, null, 2),
        );
        
        throw new Error('Not implemented.');
    }
}