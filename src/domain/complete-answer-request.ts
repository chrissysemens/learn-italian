import type { CompleteAnswer } from '@percoso/shared';
import { Exercise } from './exercise';

export interface EvaluateAnswerRequest {
  exercise: Exercise;
  answer: CompleteAnswer;
}