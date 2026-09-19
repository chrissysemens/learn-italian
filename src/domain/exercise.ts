import { ExerciseDifficulty } from '../../types';
import { CefrLevel } from './level';

export type ExerciseType =
  | 'translate_en_it'
  | 'translate_it_en'
  | 'complete'
  | 'respond'
  | 'describe'
  | 'conversation'
  | 'review';

export interface Exercise {
  id: string;
  type: ExerciseType;
  level: CefrLevel;
  difficulty: ExerciseDifficulty;
  prompt: string;
  referenceAnswers: string[];
  competencyIds: string[];
  vocabularyIds: string[];
  topicId?: string;
}