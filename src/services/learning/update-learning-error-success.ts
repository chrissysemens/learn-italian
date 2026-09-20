import { LearnerError } from '../../domain';

export const updateLearnerErrorSuccess = (
  error: LearnerError,
): LearnerError => {
  const successfulAttemptsSinceLastSeen =
    error.successfulAttemptsSinceLastSeen + 1;

  return {
    ...error,
    successfulAttemptsSinceLastSeen,
    status:
      successfulAttemptsSinceLastSeen >= 2
        ? 'resolved'
        : 'improving',
  };
}