import { db } from '@/firebase/config';
import Ingredient, { ingredientConverter } from '@/models/ingredient';
import {
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';

async function getIngredients() {
  try {
    const collectionRef = collection(
      db,
      COLLECTION_NAME.INGREDIENTS
    ).withConverter(ingredientConverter);

    const snapshot = await getDocs(collectionRef);

    const data = snapshot.docs.map((doc) => doc.data());

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

async function getIngredientById(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.INGREDIENTS, id).withConverter(
      ingredientConverter
    );

    const snapshot = await getDoc(docRef);

    return snapshot.data();
  } catch (error) {
    console.log('[DAO] Fail to get doc', error);
  }
}

async function updateIngredient(id: string, data: Ingredient) {
  try {
    const docRef = doc(db, COLLECTION_NAME.INGREDIENTS, id).withConverter(
      ingredientConverter
    );

    await updateDoc(docRef, data);
  } catch (error) {
    console.log('[DAO] Fail to update doc', error);
  }
}

async function createIngredient(data: Ingredient) {
  try {
    await addDoc(collection(db, COLLECTION_NAME.INGREDIENTS), data);
  } catch (error) {
    console.log('[DAO] Fail to create doc', error);
  }
}

async function deleteIngredient(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.INGREDIENTS, id).withConverter(
      ingredientConverter
    );

    await deleteDoc(docRef);
  } catch (error) {
    console.log('[DAO] Fail to delete doc', error);
  }
}

export {
  createIngredient,
  deleteIngredient,
  getIngredientById,
  getIngredients,
  updateIngredient,
};
