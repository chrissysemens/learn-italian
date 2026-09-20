import {
  CompetencyProgress,
  DifficultyCandidate,
} from '../../domain';

export const buildDifficultyCandidates = (
  progress?: CompetencyProgress,
): DifficultyCandidate[] => {
  if (!progress) {
    return [
      { difficulty: 'easy', weight: 0.25 },
      { difficulty: 'standard', weight: 0.6 },
      { difficulty: 'hard', weight: 0.15 },
    ];
  }

  const influence = progress.confidence;

  const easy =
    0.25 +
    (0.5 - progress.mastery) * 0.5 * influence;

  const hard =
    0.15 +
    (progress.mastery - 0.5) * 0.5 * influence;

  const standard = 0.6;

  return [
    {
      difficulty: 'easy',
      weight: Math.max(0.1, easy),
    },
    {
      difficulty: 'standard',
      weight: standard,
    },
    {
      difficulty: 'hard',
      weight: Math.max(0.1, hard),
    },
  ];
};