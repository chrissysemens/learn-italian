import {
  HttpsError,
  onCall,
} from 'firebase-functions/v2/https';

import {
  defineSecret,
} from 'firebase-functions/params';

import OpenAI from 'openai';

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
        await openai.responses.create({
          model: 'gpt-5.6-luna',
          input:
            'Say "Ciao from Percoso" and nothing else.',
        });

      console.log(
        'OPENAI RESPONSE',
        response.output_text,
      );

      return {
        text: response.output_text,
      };
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