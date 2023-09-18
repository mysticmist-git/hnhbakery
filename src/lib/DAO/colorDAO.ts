import { db } from '@/firebase/config';
import Color, { colorConverter } from '@/models/color';
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

async function getColors() {
  try {
    const collectionRef = collection(db, COLLECTION_NAME.COLORS).withConverter(
      colorConverter
    );

    const snapshot = await getDocs(collectionRef);

    const data = snapshot.docs.map((doc) => doc.data());

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

async function getColorById(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.COLORS, id).withConverter(
      colorConverter
    );

    const snapshot = await getDoc(docRef);

    return snapshot.data();
  } catch (error) {
    console.log('[DAO] Fail to get doc', error);
  }
}

async function updateColor(id: string, data: Color) {
  try {
    const docRef = doc(db, COLLECTION_NAME.COLORS, id).withConverter(
      colorConverter
    );

    await updateDoc(docRef, data);
  } catch (error) {
    console.log('[DAO] Fail to update doc', error);
  }
}

async function createColor(data: Color) {
  try {
    await addDoc(collection(db, COLLECTION_NAME.COLORS), data);
  } catch (error) {
    console.log('[DAO] Fail to create doc', error);
  }
}

async function deleteColor(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.COLORS, id).withConverter(
      colorConverter
    );

    await deleteDoc(docRef);
  } catch (error) {
    console.log('[DAO] Fail to delete doc', error);
  }
}

export { createColor, deleteColor, getColorById, getColors, updateColor };
