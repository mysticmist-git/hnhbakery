import { db } from '@/firebase/config';
import Color, { colorConverter } from '@/models/color';
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

export function getColorsRef() {
  return collection(db, COLLECTION_NAME.COLORS).withConverter(colorConverter);
}

export function getColorsRefWithQuery(...queryConstraints: QueryConstraint[]) {
  return query(getColorsRef(), ...queryConstraints).withConverter(
    colorConverter
  );
}

export function getColorRefById(id: string) {
  return doc(getColorsRef(), id).withConverter(colorConverter);
}

export async function getColorsSnapshot() {
  return await getDocs(getColorsRef());
}

export async function getColorsSnapshotWithQuery(
  ...queryConstraints: QueryConstraint[]
) {
  return await getDocs(getColorsRefWithQuery(...queryConstraints));
}

export async function getColorSnapshotById(id: string) {
  return await getDoc(getColorRefById(id));
}

export async function getColors() {
  return (await getColorsSnapshot()).docs.map((doc) => doc.data());
}

export async function getColorsWithQuery(
  ...queryConstraints: QueryConstraint[]
) {
  return (await getColorsSnapshotWithQuery(...queryConstraints)).docs.map(
    (doc) => doc.data()
  );
}

export async function getColorById(id: string) {
  return (await getColorSnapshotById(id)).data();
}

export async function updateColor(id: string, data: Color) {
  await updateDoc(getColorRefById(id), data);
}

export async function createColor(data: Omit<Color, 'id'>) {
  return await addDoc(getColorsRef(), data);
}

export async function deleteColor(id: string) {
  await deleteDoc(getColorRefById(id));
}
