// domain/competency.ts

import { ErrorRule } from './error-rule';
import { CefrLevel } from './level';

export interface Competency {
  id: string;
  level: CefrLevel;
  category: CompetencyCategory;
  name: string;
  description: string;
  tags: string[];
  errorRules: ErrorRule[];
}

export type CompetencyCategory =
  | 'grammar'
  | 'communication'
  | 'pronunciation';