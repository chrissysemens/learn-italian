import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';

import { db } from '../../config/firebase';
import { CompetencyProgress } from '../../domain';
import { CompetencyProgressRepo } from '../competency-progress-repo';

export class FsCompetencyProgressRepo
  implements CompetencyProgressRepo
{
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