import { db } from '@/firebase/config';
import Ingredient, { ingredientConverter } from '@/models/ingredient';
import {
  QueryConstraint,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';

export function getIngredientsRef() {
  return collection(db, COLLECTION_NAME.INGREDIENTS).withConverter(
    ingredientConverter
  );
}

export function getIngredientsRefWithQuery(
  ...queryConstraints: QueryConstraint[]
) {
  return query(getIngredientsRef(), ...queryConstraints);
}

export function getIngredientRefById(id: string) {
  return doc(db, COLLECTION_NAME.INGREDIENTS, id).withConverter(
    ingredientConverter
  );
}

export async function getIngredientsSnapshot() {
  return await getDocs(getIngredientsRef());
}

export async function getIngredientsSnapshotWithQuery(
  ...queryConstraints: QueryConstraint[]
) {
  return await getDocs(getIngredientsRefWithQuery(...queryConstraints));
}

export async function getIngredientSnapshotById(id: string) {
  return await getDoc(getIngredientRefById(id));
}

export async function getIngredients() {
  return (await getIngredientsSnapshot()).docs.map((doc) => doc.data());
}

export async function getIngredientsWithQuery(
  ...queryConstraints: QueryConstraint[]
) {
  return (await getIngredientsSnapshotWithQuery(...queryConstraints)).docs.map(
    (doc) => doc.data()
  );
}

export async function getIngredientById(id: string) {
  return (await getIngredientSnapshotById(id)).data();
}

export async function updateIngredient(id: string, data: Ingredient) {
  await updateDoc(getIngredientRefById(id), data);
}

export async function createIngredient(data: Omit<Ingredient, 'id'>) {
  return await addDoc(getIngredientsRef(), data);
}

export async function deleteIngredient(id: string) {
  await deleteDoc(getIngredientRefById(id));
}
