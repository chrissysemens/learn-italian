import { CompetencyProgress } from '../domain';

export interface CompetencyProgressRepo {
  get(
    learnerId: string,
    competencyId: string,
  ): Promise<CompetencyProgress | null>;

  getByLearner(
    learnerId: string,
  ): Promise<CompetencyProgress[]>;

  save(
    learnerId: string,
    progress: CompetencyProgress,
  ): Promise<void>;
}