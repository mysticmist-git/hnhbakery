import { db } from '@/firebase/config';
import Variant, { variantConverter } from '@/models/variant';
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

async function getVariants() {
  try {
    const collectionRef = collection(
      db,
      COLLECTION_NAME.VARIANTS
    ).withConverter(variantConverter);

    const snapshot = await getDocs(collectionRef);

    const data = snapshot.docs.map((doc) => doc.data());

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

async function getVariantById(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.VARIANTS, id).withConverter(
      variantConverter
    );

    const snapshot = await getDoc(docRef);

    return snapshot.data();
  } catch (error) {
    console.log('[DAO] Fail to get doc', error);
  }
}

async function updateVariant(id: string, data: Variant) {
  try {
    const docRef = doc(db, COLLECTION_NAME.VARIANTS, id).withConverter(
      variantConverter
    );

    await updateDoc(docRef, data);
  } catch (error) {
    console.log('[DAO] Fail to update doc', error);
  }
}

async function createVariant(data: Variant) {
  try {
    await addDoc(collection(db, COLLECTION_NAME.VARIANTS), data);
  } catch (error) {
    console.log('[DAO] Fail to create doc', error);
  }
}

async function deleteVariant(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.VARIANTS, id).withConverter(
      variantConverter
    );

    await deleteDoc(docRef);
  } catch (error) {
    console.log('[DAO] Fail to delete doc', error);
  }
}

export {
  createVariant,
  deleteVariant,
  getVariantById,
  getVariants,
  updateVariant,
};
