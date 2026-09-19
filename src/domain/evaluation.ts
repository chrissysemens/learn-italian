import { LearnerErrorCategory } from '../../types';

export interface TextRange {
  start: number;
  end: number;
}

export interface DetectedError {
  id: string;
  errorType: string;
  competencyId?: string;
  category: LearnerErrorCategory;

  range: TextRange;

  learnerForm: string;
  correctedForm: string;
  explanation: string;
}

export interface CompetencyEvaluation {
  competencyId: string;

  /**
   * Evidence demonstrated for this competency.
   * Range: -1.0 to 1.0.
   */
  score: number;
}

export interface Evaluation {
  /**
   * Overall quality of this attempt.
   * Range: -1.0 to 1.0.
   */
  score: number;

  feedback: string;

  competencyEvaluations: CompetencyEvaluation[];

  detectedErrors: DetectedError[];
}