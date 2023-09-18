import { db } from '@/firebase/config';
import Material, { materialConverter } from '@/models/material';
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

async function getMaterials() {
  try {
    const collectionRef = collection(
      db,
      COLLECTION_NAME.MATERIALS
    ).withConverter(materialConverter);

    const snapshot = await getDocs(collectionRef);

    const data = snapshot.docs.map((doc) => doc.data());

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

async function getMaterialById(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.MATERIALS, id).withConverter(
      materialConverter
    );

    const snapshot = await getDoc(docRef);

    return snapshot.data();
  } catch (error) {
    console.log('[DAO] Fail to get doc', error);
  }
}
async function updateMaterial(id: string, data: Material) {
  try {
    const docRef = doc(db, COLLECTION_NAME.MATERIALS, id).withConverter(
      materialConverter
    );

    await updateDoc(docRef, data);
  } catch (error) {
    console.log('[DAO] Fail to update doc', error);
  }
}

async function createMaterial(data: Material) {
  try {
    await addDoc(collection(db, COLLECTION_NAME.MATERIALS), data);
  } catch (error) {
    console.log('[DAO] Fail to create doc', error);
  }
}

async function deleteMaterial(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.MATERIALS, id).withConverter(
      materialConverter
    );

    await deleteDoc(docRef);
  } catch (error) {
    console.log('[DAO] Fail to delete doc', error);
  }
}

export {
  createMaterial,
  deleteMaterial,
  getMaterialById,
  getMaterials,
  updateMaterial,
};
