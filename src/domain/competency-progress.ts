export interface CompetencyProgress {
  competencyId: string;

  mastery: number;
  confidence: number;

  attempts: number;
  lastAttemptAt?: string;
  lastReviewedAt?: string;
}