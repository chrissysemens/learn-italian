import {
    Exercise,
    GenerateExerciseRequest,
} from '../../domain';

import {
    ExerciseGenerator,
} from '../../interfaces';

import { httpsCallable } from 'firebase/functions';

import { functions } from '../../config/firebase';
import { generatedExerciseSchema } from '../../schemas/generated-exercise-schema';

import * as Crypto from 'expo-crypto';

export class FirebaseExerciseGenerator
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

        const generateExercise =
            httpsCallable(
                functions,
                'generateExercise',
            );

        const result = await generateExercise(input);

        const generated =
            generatedExerciseSchema.parse(
                result.data,
            );

        console.log(
            'VALIDATED EXERCISE',
            generated,
        );

        return {
            id: Crypto.randomUUID(),
            type: request.type,
            level: request.level,
            difficulty: request.difficulty,
            prompt: generated.prompt,
            referenceAnswers:
                generated.referenceAnswers,
            competencyIds:
                request.context.competencies.map(
                    competency => competency.id,
                ),
            vocabularyIds: [],
            topicId: request.context.topic.id,
        };
    }
}