// domain/competency.ts

import { ErrorRule } from './error-rule';
import { CefrLevel, CompetencyCategory } from '../../types';

export interface Competency {
  id: string;
  level: CefrLevel;
  category: CompetencyCategory;
  name: string;
  description: string;
  tags: string[];
  errorRules: ErrorRule[];
}
