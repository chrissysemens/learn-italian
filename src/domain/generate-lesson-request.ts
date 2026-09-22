import {
  Competency,
  Exercise,
  Topic,
} from '.';

export interface GenerateLessonRequest {
  exercise: Exercise;
  competencies: Competency[];
  topic: Topic;
}