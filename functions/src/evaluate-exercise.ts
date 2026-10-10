import {
  HttpsError,
  onCall,
} from 'firebase-functions/v2/https';

import {
  defineSecret,
} from 'firebase-functions/params';

import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';

import {
  evaluationSchema,
} from '@percoso/shared';

import {
  completeEvaluationPrompt,
} from './prompts/complete-evaluation';


const openAiApiKey =
  defineSecret('OPENAI_API_KEY');

export const evaluateExercise = onCall(
  {
    secrets: [openAiApiKey],
  },
  async request => {
    try {
      console.log(
        'EVALUATE EXERCISE',
        request.data,
      );

      const openai = new OpenAI({
        apiKey: openAiApiKey.value(),
      });

      const response =
        await openai.responses.parse({
          model: 'gpt-6-luna',

          instructions: completeEvaluationPrompt,

          input: JSON.stringify(request.data),

          text: {
            format: zodTextFormat(
              evaluationSchema,
              'exercise_evaluation',
            ),
          },
        });

      const evaluation = response.output_parsed;

      if (!evaluation) {
        throw new Error(
          'OpenAI did not return an evaluation.',
        );
      }

      console.log(
        'EXERCISE EVALUATION',
        JSON.stringify(evaluation, null, 2),
      );

      return evaluation;
    } catch (error) {
      console.error(
        'OPENAI EVALUATION ERROR',
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
        'Exercise evaluation failed.',
      );
    }
  },
);