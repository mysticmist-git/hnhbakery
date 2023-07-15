import { db } from '@/firebase/config';
import {
  DocumentData,
  FirestoreDataConverter,
  Timestamp,
  and,
  collection,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { useMemo } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { COLLECTION_NAME } from '../constants';
import { SaleObject } from '../models';

const saleConverter: FirestoreDataConverter<SaleObject> = {
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options)!;

    const result: SaleObject = {
      ...data,
      id: snapshot.id,
      start_at: data.start_at.toDate(),
      end_at: data.end_at.toDate(),
    } as SaleObject;

    return result;
  },

  toFirestore(data: SaleObject) {
    delete data.id;

    return { ...data };
  },
};

const saleQuery = query(
  collection(db, COLLECTION_NAME.SALES),
  where('isActive', '==', true)
);

function useSales() {
  const [value, loading, error, snapshot] = useCollectionData<SaleObject>(
    saleQuery.withConverter(saleConverter),
    {
      initialValue: [],
    }
  );

  const filterdValue = useMemo(() => {
    return value?.filter((v) => v.end_at > new Date());
  }, [value]);

  return {
    value: filterdValue,
    loading,
    error,
    snapshot,
  };
}

export default useSales;
