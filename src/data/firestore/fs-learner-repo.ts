import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';

import { db } from '../../config/firebase';
import { Learner } from '../../domain';
import { LearnerRepo } from '../learner-repo';

export class FSLearnerRepo
  implements LearnerRepo {

  async get(id: string): Promise<Learner | null> {
    const ref = doc(db, 'learners', id);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as Learner;
  }

  async save(learner: Learner): Promise<void> {
    const { id, ...data } = learner;

    await setDoc(
      doc(db, 'learners', id),
      data,
    );
  }
}