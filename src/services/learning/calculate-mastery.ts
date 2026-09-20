import { ExerciseDifficulty } from '../../../types';

const BASE_MASTERY_CHANGE = 0.05;

const difficultyWeights = {
  easy: {
    success: 0.5,
    failure: 1.5,
  },
  standard: {
    success: 1.0,
    failure: 1.0,
  },
  hard: {
    success: 1.5,
    failure: 0.5,
  },
} satisfies Record<
  ExerciseDifficulty,
  {
    success: number;
    failure: number;
  }
>;

export const calculateMastery = (
  currentMastery: number,
  evaluationScore: number,
  difficulty: ExerciseDifficulty,
): number => {
  const weight =
    evaluationScore >= 0
      ? difficultyWeights[difficulty].success
      : difficultyWeights[difficulty].failure;

  const change =
    BASE_MASTERY_CHANGE *
    evaluationScore *
    weight;

  return Math.max(
    0,
    Math.min(1, currentMastery + change),
  );
}