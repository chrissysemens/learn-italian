import { Exercise } from "../../domain";

export interface EvaluateAnswerRequest {
  exercise: Exercise;
  answer: string;
}