import {
  Competency,
  Exercise,
  Lesson,
  Topic,
} from '../../domain';

import {
  LessonGenerator,
  LessonRepo,
} from '../../interfaces';

export class LessonService {
  constructor(
    private readonly lessonGenerator: LessonGenerator,
    private readonly lessonRepo: LessonRepo,
  ) {}

  async createLesson(
    learnerId: string,
    exercise: Exercise,
    competencies: Competency[],
    topic: Topic,
  ): Promise<Lesson> {
    const newLesson =
      await this.lessonGenerator.generate({
        exercise,
        competencies,
        topic,
      });

    return this.lessonRepo.create(
      learnerId,
      newLesson,
    );
  }
}