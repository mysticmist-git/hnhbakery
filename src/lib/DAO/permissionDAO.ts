import { db } from '@/firebase/config';
import Permission, { permissionConverter } from '@/models/permission';
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

export function getPermissionsRef() {
  return collection(db, COLLECTION_NAME.PERMISSIONS).withConverter(
    permissionConverter
  );
}

export function getPermissionRefById(id: string) {
  return doc(db, COLLECTION_NAME.PERMISSIONS, id).withConverter(
    permissionConverter
  );
}

export async function getPermissionSnapshots() {
  const collectionRef = getPermissionsRef();

  return await getDocs(collectionRef);
}

export async function getPermissions() {
  const snapshot = await getPermissionSnapshots();

  return snapshot.docs.map((doc) => doc.data());
}

export async function getPermissionSnapshotById(id: string) {
  const docRef = getPermissionRefById(id);

  return await getDoc(docRef);
}

export async function getPermissionById(id: string) {
  return (await getPermissionSnapshotById(id)).data();
}

export async function updatePermission(id: string, data: Permission) {
  const docRef = getPermissionRefById(id);

  await updateDoc(docRef, data);
}

export async function createPermission(data: Omit<Permission, 'id'>) {
  await addDoc(getPermissionsRef(), data);
}

export async function deletePermission(id: string) {
  const docRef = getPermissionRefById(id);

  await deleteDoc(docRef);
}
