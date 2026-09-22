import { Evaluation } from '.'
import { EvaluateAnswerRequest } from './evaluate-answer-request';

export interface AnswerEvaluator {
  evaluate(
    request: EvaluateAnswerRequest,
  ): Promise<Evaluation>;
}