import { ExerciseDifficulty } from '../../../types';

interface DifficultyCandidate {
  difficulty: ExerciseDifficulty;
  weight: number;
}

export const selectDifficulty = (
  candidates: DifficultyCandidate[],
): ExerciseDifficulty => {
  if (candidates.length === 0) {
    throw new Error(
      'Cannot select difficulty from an empty list.',
    );
  }

  const totalWeight = candidates.reduce(
    (total, candidate) => total + candidate.weight,
    0,
  );

  let random = Math.random() * totalWeight;

  for (const candidate of candidates) {
    random -= candidate.weight;

    if (random <= 0) {
      return candidate.difficulty;
    }
  }

  return candidates[candidates.length - 1].difficulty;
};