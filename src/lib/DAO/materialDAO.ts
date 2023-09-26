import { db } from '@/firebase/config';
import Material, { materialConverter } from '@/models/material';
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

export function getMaterialsRef() {
  return collection(db, COLLECTION_NAME.MATERIALS).withConverter(
    materialConverter
  );
}

export function getMaterialsRefWithQuery(
  ...queryConstraints: QueryConstraint[]
) {
  return query(getMaterialsRef(), ...queryConstraints).withConverter(
    materialConverter
  );
}

export function getMaterialRefById(id: string) {
  return doc(getMaterialsRef(), id).withConverter(materialConverter);
}

export async function getMaterialsSnapshot() {
  return await getDocs(getMaterialsRef());
}

export async function getMaterialsSnapshotWithQuery(
  ...queryConstraints: QueryConstraint[]
) {
  return await getDocs(getMaterialsRefWithQuery(...queryConstraints));
}

export async function getMaterialSnapshotById(id: string) {
  return await getDoc(getMaterialRefById(id));
}

export async function getMaterials() {
  return (await getMaterialsSnapshot()).docs.map((doc) => doc.data());
}

export async function getMaterialsWithQuery(
  ...queryConstraints: QueryConstraint[]
) {
  return (await getMaterialsSnapshotWithQuery(...queryConstraints)).docs.map(
    (doc) => doc.data()
  );
}

export async function createMaterial(data: Omit<Material, 'id'>) {
  return await addDoc(getMaterialsRef(), data);
}

export async function updateMaterial(id: string, data: Material) {
  await updateDoc(getMaterialRefById(id), data);
}

export async function deleteMaterial(id: string) {
  await deleteDoc(getMaterialRefById(id));
}
