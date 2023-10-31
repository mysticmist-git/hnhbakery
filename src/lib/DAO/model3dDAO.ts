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
import Model3d, { model3dConverter } from '@/models/model3d';
import { db } from '@/firebase/config';

export function getModel3dRef() {
  return collection(db, COLLECTION_NAME.MODEL_3D).withConverter(
    model3dConverter
  );
}

export function getModel3dRefById(id: string) {
  return doc(getModel3dRef(), id).withConverter(model3dConverter);
}

export async function getModel3dSnapshot() {
  return await getDocs(getModel3dRef());
}

export async function getModel3dSnapshotById(id: string) {
  return await getDoc(getModel3dRefById(id));
}

export async function getAllModel3d() {
  return (await getModel3dSnapshot()).docs.map((doc) => doc.data());
}

export async function getModel3dById(id: string) {
  return (await getModel3dSnapshotById(id)).data();
}

export async function updateModel3d(id: string, data: Model3d) {
  await updateDoc(getModel3dRefById(id), data);
}

export async function createModel3d(data: Omit<Model3d, 'id'>) {
  return await addDoc(getModel3dRef(), data);
}

export async function deleteModel3d(id: string) {
  await deleteDoc(getModel3dRefById(id));
}
