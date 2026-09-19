import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';

import { db } from '../../config/firebase';
import { LearnerError } from '../../domain';
import { LearnerErrorRepo } from '../learner-error-repo';

export class FsLearnerErrorRepo
  implements LearnerErrorRepo
{
  async get(
    learnerId: string,
    competencyId: string,
    errorType: string,
  ): Promise<LearnerError | null> {
    const id = this.getId(
      competencyId,
      errorType,
    );

    const ref = doc(
      db,
      'learners',
      learnerId,
      'errors',
      id,
    );

    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data() as LearnerError;
  }

  async save(
    learnerId: string,
    error: LearnerError,
  ): Promise<void> {
    const id = this.getId(
      error.competencyId,
      error.errorType,
    );

    const ref = doc(
      db,
      'learners',
      learnerId,
      'errors',
      id,
    );

    await setDoc(ref, error);
  }

  private getId(
    competencyId: string,
    errorType: string,
  ): string {
    return `${competencyId}__${errorType}`;
  }
}