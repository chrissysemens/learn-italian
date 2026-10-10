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
} from '@percoso/shared';
import { exerciseGenerationPrompt } from './prompts/exercise-generation';
import { completeExercisePrompt } from './prompts/complete-exercise';
import {
    singleWordBlankPrompt,
} from './prompts/blank-strategies';


const openAiApiKey =
  defineSecret('OPENAI_API_KEY');

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

      const response =
        await openai.responses.parse({
          model: 'gpt-6-luna',

          instructions: [
            exerciseGenerationPrompt,
            completeExercisePrompt,
            singleWordBlankPrompt,
          ].join('\n\n'),

          input: JSON.stringify(request.data),

          /*text: {
            format: zodTextFormat(
              generatedExerciseSchema,
              'generated_exercise',
            ),
          },*/
        text: {
          format: zodTextFormat(
            completeContentSchema,
            'complete_exercise',
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
