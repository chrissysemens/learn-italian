import { httpsCallable } from 'firebase/functions';

import {
  evaluationSchema,
  type CompleteAnswer,
} from '@percoso/shared';

import { functions } from '../../config/firebase';
import type { Exercise } from '../../domain';

export class FirebaseExerciseEvaluator {
  async evaluate(
    exercise: Exercise,
    answer: CompleteAnswer,
  ) {
    if (!exercise.completeContent) {
      throw new Error(
        'Exercise has no completion content.',
      );
    }

    const evaluateExercise = httpsCallable(
      functions,
      'evaluateExercise',
    );

    const result = await evaluateExercise({
      exercise: {
        id: exercise.id,
        type: exercise.type,
        instruction: exercise.completeContent.instruction,
        segments: exercise.completeContent.segments,
        answers: exercise.completeContent.answers,
        competencyIds: exercise.competencyIds,
      },
      answer,
    });

    const evaluation = evaluationSchema.parse(
      result.data,
    );

    console.log(
      'VALIDATED EVALUATION',
      JSON.stringify(evaluation, null, 2),
    );

    return evaluation;
  }
}