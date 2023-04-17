import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { CollectionObject } from './models/utilities';

export async function fetchData(collectionName: string) {
  if (!collectionName || collectionName === '') {
    return [];
  }

  const querySnapshot = await getDocs(collection(db, collectionName));

  let docs = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return docs;
}
