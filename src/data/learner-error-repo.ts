import { LearnerError } from '../domain';

export interface LearnerErrorRepo {
  get(
    learnerId: string,
    competencyId: string,
    errorType: string,
  ): Promise<LearnerError | null>;

  save(
    learnerId: string,
    error: LearnerError,
  ): Promise<void>;
}