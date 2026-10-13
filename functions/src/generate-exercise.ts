import {
    HttpsError,
    onCall,
} from 'firebase-functions/v2/https';

import {
    defineSecret,
} from 'firebase-functions/params';

import OpenAI from 'openai';

import { zodTextFormat } from 'openai/helpers/zod';
//import { generatedExerciseSchema } from '@percoso/shared';
import {
    completeContentSchema,
    translateEnItContentSchema,
} from '@percoso/shared';
import { exerciseGenerationPrompt } from './prompts/exercise-generation';
import { completeExercisePrompt } from './prompts/complete-exercise';
import { translateEnItExercisePrompt } from './prompts/translate-en-it-exercise';
import {
    singleWordBlankPrompt,
} from './prompts/blank-strategies';



const openAiApiKey =
    defineSecret('OPENAI_API_KEY');


const generationConfigs = {
    complete: {
        schema: completeContentSchema,
        schemaName: 'complete_exercise',
        prompts: [
            completeExercisePrompt,
            singleWordBlankPrompt,
        ],
    },
    translate_en_it: {
        schema: translateEnItContentSchema,
        schemaName: 'translate_en_it_exercise',
        prompts: [
            translateEnItExercisePrompt,
        ],
    },
} as const;

export const generateExercise = onCall(
    {
        secrets: [openAiApiKey],
    },
    async request => {
        try {
            console.log(
                'GENERATE EXERCISE',
                request.data,
            );

            const openai = new OpenAI({
                apiKey: openAiApiKey.value(),
            });

            const type: unknown = request.data?.type;

            if (
                type !== 'complete' &&
                type !== 'translate_en_it'
            ) {
                throw new HttpsError(
                    'invalid-argument',
                    'Unsupported exercise type.',
                );
            }

            const config = generationConfigs[type];

            const response = await openai.responses.parse({
                model: 'gpt-6-luna',

                instructions: [
                    exerciseGenerationPrompt,
                    ...config.prompts,
                ].join('\n\n'),

                input: JSON.stringify(request.data),

                text: {
                    format: zodTextFormat(
                        config.schema,
                        config.schemaName,
                    ),
                },
            });

            const exercise = response.output_parsed;

            if (!exercise) {
                throw new Error(
                    'OpenAI did not return a generated exercise.',
                );
            }

            console.log(
                'GENERATED EXERCISE',
                JSON.stringify(exercise, null, 2),
            );

            return exercise;
        } catch (error) {
            console.error(
                'OPENAI ERROR',
                error,
            );

            if (error instanceof OpenAI.APIError) {
                console.error(
                    'OPENAI STATUS',
                    error.status,
                );

                console.error(
                    'OPENAI CODE',
                    error.code,
                );

                console.error(
                    'OPENAI MESSAGE',
                    error.message,
                );
            }

            throw new HttpsError(
                'internal',
                'Exercise generation failed.',
            );
        }
    },
);
