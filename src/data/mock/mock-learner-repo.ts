import { Learner } from '../../domain';
import { LearnerRepo } from '../learner-repo';

export class MockLearnerRepo implements LearnerRepo{
  private learner: Learner = {
    id: 'me',
    firstName: 'Christopher',
    surname: 'Semens',
    email: 'chrissy.semens@example.com',
    currentLevel: 'A1',
    createdAt: new Date().toISOString(),
  };

  async get(id: string): Promise<Learner | null> {
    return id === this.learner.id ? this.learner : null;
  }

  async save(learner: Learner): Promise<void> {
    this.learner = learner;
  }
}