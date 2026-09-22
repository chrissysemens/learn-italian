import {
  GenerateLessonRequest,
  NewLesson,
} from '../domain';

export interface LessonGenerator {
  generate(
    request: GenerateLessonRequest,
  ): Promise<NewLesson>;
}