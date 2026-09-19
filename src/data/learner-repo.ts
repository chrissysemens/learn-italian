import { Learner } from "../domain";

export interface LearnerRepo {
  get(id: string): Promise<Learner | null>;
  save(learner: Learner): Promise<void>;
}