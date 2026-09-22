import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';

import { db } from '../../config/firebase';
import { CompetencyProgress } from '../../domain';
import { CompetencyProgressRepo } from '../../interfaces';

export class FsCompetencyProgressRepo
  implements CompetencyProgressRepo {
  async get(
    learnerId: string,
    competencyId: string,
  ): Promise<CompetencyProgress | null> {
    const ref = doc(
      db,
      'learners',
      learnerId,
      'competencyProgress',
      competencyId,
    );

    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      competencyId: snapshot.id,
      ...snapshot.data(),
    } as CompetencyProgress;
  }

  async getByLearner(
    learnerId: string,
  ): Promise<CompetencyProgress[]> {
    const ref = collection(
      db,
      'learners',
      learnerId,
      'competencyProgress',
    );

    const snapshot = await getDocs(ref);

    return snapshot.docs.map(doc => ({
      ...doc.data(),
      competencyId: doc.id,
    }) as CompetencyProgress);
  }

  async save(
    learnerId: string,
    progress: CompetencyProgress,
  ): Promise<void> {
    const ref = doc(
      db,
      'learners',
      learnerId,
      'competencyProgress',
      progress.competencyId,
    );

    const {
      competencyId,
      ...data
    } = progress;

    await setDoc(ref, data);
  }
}