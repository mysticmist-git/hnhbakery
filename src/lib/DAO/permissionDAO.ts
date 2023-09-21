import { db } from '@/firebase/config';
import Permission, { permissionConverter } from '@/models/permission';
import {
  DocumentReference,
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
  return doc(getPermissionsRef(), id).withConverter(permissionConverter);
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

export async function updatePermission(
  id: string,
  data: Permission
): Promise<void>;
export async function updatePermission(
  docRef: DocumentReference<Permission>,
  data: Permission
): Promise<void>;
export async function updatePermission(
  arg: string | DocumentReference<Permission>,
  data: Permission
) {
  await updateDoc(
    typeof arg === 'string' ? getPermissionRefById(arg) : arg,
    data
  );
}

export async function createPermission(data: Omit<Permission, 'id'>) {
  return (await addDoc(getPermissionsRef(), data)).withConverter(
    permissionConverter
  );
}

export async function deletePermission(id: string): Promise<void>;
export async function deletePermission(
  docRef: DocumentReference<Permission>
): Promise<void>;
export async function deletePermission(
  arg: string | DocumentReference<Permission>
) {
  const docRef = typeof arg === 'string' ? getPermissionRefById(arg) : arg;

  await deleteDoc(docRef);
}
