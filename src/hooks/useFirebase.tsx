import {
  collection,
  onSnapshot,
  query,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { db } from '../config/firebase';

interface UseCollectionProps {
  collectionName: string;
  constraints?: QueryConstraint[];
}

export const useCollection = <T extends DocumentData>({
  collectionName,
  constraints = [],
}: UseCollectionProps) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const ref = collection(db, collectionName);
    const q = query(ref, ...constraints);

    return onSnapshot(
      q,
      snapshot => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as T[];

        setData(items);
        setLoading(false);
      },
      error => {
        setError(error);
        setLoading(false);
      },
    );
  }, [collectionName, constraints]);

  return {
    data,
    loading,
    error,
  };
}