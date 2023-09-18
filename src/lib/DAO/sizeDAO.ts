import { db } from '@/firebase/config';
import Size, { sizeConverter } from '@/models/size';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';

async function getSizes() {
  try {
    const collectionRef = collection(db, COLLECTION_NAME.SIZES).withConverter(
      sizeConverter
    );

    const snapshot = await getDocs(collectionRef);

    const data = snapshot.docs.map((doc) => doc.data());

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

async function getSizeById(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.SIZES, id).withConverter(
      sizeConverter
    );

    const snapshot = await getDoc(docRef);

    return snapshot.data();
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

async function updateSize(id: string, data: Size) {
  try {
    const docRef = doc(db, COLLECTION_NAME.SIZES, id).withConverter(
      sizeConverter
    );

    await updateDoc(docRef, data);
  } catch (error) {
    console.log('[DAO] Fail to update doc', error);
  }
}

async function createSize(data: Size) {
  try {
    await addDoc(collection(db, COLLECTION_NAME.SIZES), data);
  } catch (error) {
    console.log('[DAO] Fail to create doc', error);
  }
}

async function deleteSize(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.SIZES, id).withConverter(
      sizeConverter
    );

    await deleteDoc(docRef);
  } catch (error) {
    console.log('[DAO] Fail to delete doc', error);
  }
}

export { createSize, deleteSize, getSizeById, getSizes, updateSize };
