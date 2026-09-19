import { CompetencyProgress } from '../../domain';
import { ExerciseDifficulty } from '../../../types';
import { calculateMastery } from './calculate-mastery';
import { calculateConfidence } from './calculate-confidence';

export function updateCompetencyProgress(
  progress: CompetencyProgress,
  evaluationScore: number,
  difficulty: ExerciseDifficulty,
): CompetencyProgress {
  return {
    ...progress,

    mastery: calculateMastery(
      progress.mastery,
      evaluationScore,
      difficulty,
    ),

    confidence: calculateConfidence(
      progress.confidence,
    ),

    attempts: progress.attempts + 1,
    lastAttemptAt: new Date().toISOString(),
  };
}