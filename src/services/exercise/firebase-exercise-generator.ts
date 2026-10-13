import {
    Exercise,
    GenerateExerciseRequest,
} from '../../domain';

import {
    ExerciseGenerator,
} from '../../interfaces';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../config/firebase';
import {
    completeContentSchema,
    translateEnItContentSchema,
} from '@percoso/shared';

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

        console.log(
            'RAW RESPONSE',
            JSON.stringify(result.data, null, 2),
        );


        const baseExercise = {
            id: Crypto.randomUUID(),
            level: request.level,
            difficulty: request.difficulty,
            competencyIds: request.context.competencies.map(
                competency => competency.id,
            ),
            vocabularyIds: [],
            topicId: request.context.topic.id,
            referenceAnswers: [],
        };

        switch (request.type) {
            case 'complete': {
                const generated = completeContentSchema.parse(
                    result.data,
                );

                return {
                    ...baseExercise,
                    type: 'complete',
                    prompt: generated.instruction,
                    completeContent: generated,
                };
            }

            case 'translate_en_it': {
                const generated = translateEnItContentSchema.parse(
                    result.data,
                );

                return {
                    ...baseExercise,
                    type: 'translate_en_it',
                    prompt: generated.instruction,
                    translateEnItContent: generated,
                };
            }

            default:
                throw new Error(
                    `Unsupported exercise type: ${request.type}`,
                );
        }
    }
}
