import { Exercise } from "./exercise";

export interface EvaluateAnswerRequest {
  exercise: Exercise;
  answer: string;
  assisted: boolean;
}