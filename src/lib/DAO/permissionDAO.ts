import { db } from '@/firebase/config';
import Permission, { permissionConverter } from '@/models/permission';
import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';

export function getPermissionsRef(): CollectionReference<Permission> {
  return collection(db, COLLECTION_NAME.PERMISSIONS).withConverter(
    permissionConverter
  );
}

export function getPermissionRefById(
  id: string
): DocumentReference<Permission> {
  return doc(getPermissionsRef(), id).withConverter(permissionConverter);
}

export async function getPermissionSnapshots(): Promise<
  QuerySnapshot<Permission>
> {
  const collectionRef = getPermissionsRef();

  return await getDocs(collectionRef);
}

export async function getPermissions(): Promise<Permission[]> {
  const snapshot = await getPermissionSnapshots();

  return snapshot.docs.map((doc) => doc.data());
}

export async function getPermissionSnapshotById(
  id: string
): Promise<DocumentSnapshot<Permission>> {
  const docRef = getPermissionRefById(id);

  return await getDoc(docRef);
}

export async function getPermissionById(
  id: string
): Promise<Permission | undefined> {
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
): Promise<void> {
  await updateDoc(
    typeof arg === 'string' ? getPermissionRefById(arg) : arg,
    data
  );
}

export async function createPermission(
  data: Omit<Permission, 'id'>
): Promise<DocumentReference<Permission>> {
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
): Promise<void> {
  const docRef = typeof arg === 'string' ? getPermissionRefById(arg) : arg;

  await deleteDoc(docRef);
}
