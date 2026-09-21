import {
  Competency,
  Topic,
} from '.';

export interface ExerciseGenerationContext {
  competencies: Competency[];
  topic: Topic;
}