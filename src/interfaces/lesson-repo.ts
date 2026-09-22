import { Lesson, NewLesson } from '../domain';

export interface LessonRepo {
  getLatest(
    learnerId: string,
  ): Promise<Lesson | null>;

  getBySequence(
    learnerId: string,
    sequence: number,
  ): Promise<Lesson | null>;

create(
  learnerId: string,
  lesson: NewLesson,
): Promise<Lesson>;
}