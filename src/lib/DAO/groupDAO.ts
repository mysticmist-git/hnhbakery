import { db } from '@/firebase/config';
import Group, { groupConverter } from '@/models/group';
import {
  DocumentReference,
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

export const DEFAULT_GROUP_ID = 'default';

export function getGroupsRef() {
  return collection(db, COLLECTION_NAME.GROUPS).withConverter(groupConverter);
}

export function getGroupsRefWithQuery(...queryConstraints: QueryConstraint[]) {
  return query(getGroupsRef(), ...queryConstraints);
}

export function getGroupRefById(id: string) {
  return doc(getGroupsRef(), id);
}

export async function getGroupSnapshots() {
  const collectionRef = getGroupsRef();

  return await getDocs(collectionRef);
}

export async function getGroups() {
  const snapshot = await getGroupSnapshots();

  return snapshot.docs.map((doc) => doc.data());
}

export async function getGroupsSnapshotWithQuery(
  ...queryConstraints: QueryConstraint[]
) {
  const collectionRef = getGroupsRefWithQuery(...queryConstraints);

  return await getDocs(collectionRef);
}

export async function getGroupsWithQuery(
  ...queryConstraints: QueryConstraint[]
) {
  return (await getGroupsSnapshotWithQuery(...queryConstraints)).docs.map(
    (doc) => doc.data()
  );
}

export async function getGroupSnapshotById(id: string) {
  return await getDoc(getGroupRefById(id));
}

export async function getGroupById(id: string) {
  const snapshot = await getGroupSnapshotById(id);

  return snapshot.data();
}

export async function getDefaultGroupSnapshot() {
  return await getGroupSnapshotById(DEFAULT_GROUP_ID);
}

export async function getDefaultGroup() {
  return await getGroupById(DEFAULT_GROUP_ID);
}

export async function updateGroup(
  docRef: DocumentReference<Group>,
  data: Group
): Promise<void>;
export async function updateGroup(id: string, data: Group): Promise<void>;
export async function updateGroup(
  arg: string | DocumentReference<Group>,
  data: Group
): Promise<void> {
  await updateDoc(typeof arg == 'string' ? getGroupRefById(arg) : arg, data);
}

export async function createGroup(data: Omit<Group, 'id'>) {
  return (
    await addDoc(collection(db, COLLECTION_NAME.GROUPS), data)
  ).withConverter(groupConverter);
}

export async function deleteGroup(id: string): Promise<void>;
export async function deleteGroup(
  docRef: DocumentReference<Group>
): Promise<void>;
export async function deleteGroup(arg: string | DocumentReference<Group>) {
  await deleteDoc(typeof arg == 'string' ? getGroupRefById(arg) : arg);
}
