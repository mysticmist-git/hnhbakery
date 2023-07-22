import { db } from '@/firebase/config';
import {
  FirestoreDataConverter,
  Timestamp,
  collection,
  query,
  where,
} from 'firebase/firestore';
import { useMemo } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { COLLECTION_NAME } from '../constants';
import { SaleObject } from '../models';

const saleConverter: FirestoreDataConverter<SaleObject> = {
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options)!;

    console.log(data);

    const result: SaleObject = {
      ...data,
      id: snapshot.id,
      start_at:
        data.start_at instanceof Timestamp
          ? data.start_at.toDate()
          : data.start_at,
      end_at:
        data.end_at instanceof Timestamp ? data.end_at.toDate() : data.end_at,
    } as SaleObject;

    console.log(result);

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

  console.log(value);
  console.log(filterdValue);

  return {
    value: filterdValue,
    loading,
    error,
    snapshot,
  };
}

export default useSales;
