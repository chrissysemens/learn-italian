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
  generatedExerciseSchema,
} from './schemas/generated-exercise-schema';

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

          instructions: `
            You generate Italian language exercises for a learner.

            Generate one exercise using the supplied curriculum context.

            The supplied competency is the primary learning target.
            Keep all language appropriate to the supplied CEFR level.

            Use the supplied topic as natural context where possible.
            Prefer a natural, believable exercise over forcing the topic
            into an unnatural situation.

            Difficulty controls the amount of scaffolding and production
            demand, not the CEFR level of the language.

            Do not make unrelated or advanced vocabulary the primary
            source of difficulty.
          `.trim(),

          input: JSON.stringify(request.data),

          text: {
            format: zodTextFormat(
              generatedExerciseSchema,
              'generated_exercise',
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
        exercise,
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