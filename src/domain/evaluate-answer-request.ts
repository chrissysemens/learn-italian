import { Exercise } from ".";

export interface EvaluateAnswerRequest {
  exercise: Exercise;
  answer: string;
}