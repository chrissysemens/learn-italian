// learner-error.ts

import { LearnerErrorCategory, LearnerErrorStatus } from "../../types";

export interface LearnerError {
  errorType: string;
  competencyId: string;
  category: LearnerErrorCategory;
  learnerForm: string;
  correctedForm: string;
  explanation: string;

  occurrences: number;
  successfulAttemptsSinceLastSeen: number;

  lastSeen?: string;
  status: LearnerErrorStatus;
}