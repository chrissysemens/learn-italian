import { CefrLevel } from '../../types';

export interface Learner {
  id: string;
  firstName: string;
  surname: string;
  email: string;
  currentLevel: CefrLevel;

  createdAt: string;
  lastActiveAt?: string;
}