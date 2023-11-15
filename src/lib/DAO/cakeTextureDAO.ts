import { db } from '@/firebase/config';
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
import CakeTexture, { cakeTextureConverter } from '@/models/cakeTexture';

export function getCakeTexturesRef() {
  return collection(db, COLLECTION_NAME.CAKE_TEXTURES).withConverter(
    cakeTextureConverter
  );
}

export function getCakeTextureRefById(id: string) {
  return doc(getCakeTexturesRef(), id).withConverter(cakeTextureConverter);
}

export async function getCakeTexturesSnapshot() {
  return await getDocs(getCakeTexturesRef());
}

export async function getCakeTextureSnapshotById(id: string) {
  return await getDoc(getCakeTextureRefById(id));
}

export async function getCakeTextures() {
  return (await getCakeTexturesSnapshot()).docs.map((doc) => doc.data());
}

export async function getCakeTextureById(id: string) {
  return (await getCakeTextureSnapshotById(id)).data();
}

export async function updateCakeTexture(id: string, data: CakeTexture) {
  await updateDoc(getCakeTextureRefById(id), data);
}

export async function createCakeTexture(data: Omit<CakeTexture, 'id'>) {
  return await addDoc(getCakeTexturesRef(), data);
}

export async function deleteCakeTexture(id: string) {
  await deleteDoc(getCakeTextureRefById(id));
}
