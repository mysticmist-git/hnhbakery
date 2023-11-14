import { db } from '@/firebase/config';
import Province, { provinceConverter } from '@/models/province';
import {
  CollectionReference,
  QuerySnapshot,
  collection,
  getDocs,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';

export const getProvincesRef = (): CollectionReference<Province> => {
  return collection(db, COLLECTION_NAME.PROVINCES).withConverter(
    provinceConverter
  );
};

export const getProvincesSnapshot = (): Promise<QuerySnapshot<Province>> => {
  return getDocs(getProvincesRef())
    .then((snapshot) => snapshot)
    .catch(() => {
      throw new Error('Fail to get provinces.');
    });
};

export const getProvinces = (): Promise<Province[]> => {
  return getProvincesSnapshot()
    .then((snapshot) => {
      return snapshot.docs.map((doc) => doc.data());
    })
    .catch(() => []);
};
