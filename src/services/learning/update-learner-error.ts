import {
  DetectedError,
  LearnerError,
} from '../../domain';

export const updateLearnerError = (
  detected: DetectedError,
  existing: LearnerError | null,
): LearnerError => {
  if (!detected.competencyId) {
    throw new Error(
      'Cannot persist a learner error without a competencyId.',
    );
  }

  return {
    errorType: detected.errorType,
    competencyId: detected.competencyId,
    category: detected.category,
    learnerForm: detected.learnerForm,
    correctedForm: detected.correctedForm,
    explanation: detected.explanation,
    occurrences: (existing?.occurrences ?? 0) + 1,
    successfulAttemptsSinceLastSeen: 0,
    lastSeen: new Date().toISOString(),
    status: 'active',
  };
}