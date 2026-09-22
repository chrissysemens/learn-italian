import {
  collection,
  doc,
  runTransaction,
} from 'firebase/firestore';

import { db } from '../../config/firebase';
import {
  Lesson,
  NewLesson,
} from '../../domain';
import { LessonRepo } from '../../interfaces';

export class FsLessonRepo implements LessonRepo {
  async create(
    learnerId: string,
    lesson: NewLesson,
  ): Promise<Lesson> {
    // Mocked to satisfy the interface
    return {
      id: 'mock-lesson',
      sequence: 1,
      createdAt: new Date().toISOString(),
      ...lesson,
    };
  }

  async getLatest(
    learnerId: string,
  ): Promise<Lesson | null> {
    throw new Error('Not implemented.');
  }

  async getBySequence(
    learnerId: string,
    sequence: number,
  ): Promise<Lesson | null> {
    throw new Error('Not implemented.');
  }
}