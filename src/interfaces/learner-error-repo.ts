import { LearnerError } from "../domain";

export interface LearnerErrorRepo {
  get(
    learnerId: string,
    competencyId: string,
    errorType: string,
  ): Promise<LearnerError | null>;

  getByCompetency(
    learnerId: string,
    competencyId: string,
  ): Promise<LearnerError[]>;

  getByLearner(
  learnerId: string,
): Promise<LearnerError[]>;

  save(
    learnerId: string,
    error: LearnerError,
  ): Promise<void>;
}