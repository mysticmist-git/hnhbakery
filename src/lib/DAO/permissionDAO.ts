import { db } from '@/firebase/config';
import Permission, { permissionConverter } from '@/models/permission';
import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  Query,
  QueryConstraint,
  QuerySnapshot,
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

export function getPermissionsRefWithQuery(
  ...queryConstraints: QueryConstraint[]
): Query<Permission> {
  return query(getPermissionsRef(), ...queryConstraints);
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

export async function getPermissionsSnapshotWithQuery(
  ...queryConstraints: QueryConstraint[]
): Promise<QuerySnapshot<Permission>> {
  return await getDocs(query(getPermissionsRef(), ...queryConstraints));
}

export async function getPermissionsWithQuery(
  ...queryConstraints: QueryConstraint[]
): Promise<Permission[]> {
  return (
    await getDocs(query(getPermissionsRef(), ...queryConstraints))
  ).docs.map((doc) => doc.data());
}

export async function getPermissionSnapshot(
  id: string
): Promise<DocumentSnapshot<Permission>>;
export async function getPermissionSnapshot(
  permissionRef: DocumentReference<Permission>
): Promise<DocumentSnapshot<Permission>>;
export async function getPermissionSnapshot(
  arg: string | DocumentReference<Permission>
): Promise<DocumentSnapshot<Permission>> {
  if (typeof arg === 'string') {
    return await getDoc(getPermissionRefById(arg));
  } else {
    return await getDoc(arg);
  }
}

export async function getPermission(
  id: string
): Promise<Permission | undefined>;
export async function getPermission(
  permissionRef: DocumentReference<Permission>
): Promise<Permission | undefined>;
export async function getPermission(
  arg: string | DocumentReference<Permission>
): Promise<Permission | undefined> {
  if (typeof arg === 'string') {
    return (await getPermissionSnapshot(arg)).data();
  } else {
    return (await getPermissionSnapshot(arg)).data();
  }
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
  permissionRef: DocumentReference<Permission>
): Promise<void>;
export async function deletePermission(
  arg: string | DocumentReference<Permission>
): Promise<void> {
  const docRef = typeof arg === 'string' ? getPermissionRefById(arg) : arg;

  await deleteDoc(docRef);
}
