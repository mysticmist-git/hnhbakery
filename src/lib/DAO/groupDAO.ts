import { db } from '@/firebase/config';
import Group, { groupConverter } from '@/models/group';
import User, { userConverter } from '@/models/user';
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

export const DEFAULT_GROUP_ID = 'default';

export function getGroupsRef() {
  return collection(db, COLLECTION_NAME.GROUPS).withConverter(groupConverter);
}

export function getGroupRefById(id: string) {
  return doc(db, COLLECTION_NAME.GROUPS, id).withConverter(groupConverter);
}

export async function getGroupSnapshots() {
  const collectionRef = getGroupsRef();

  return await getDocs(collectionRef);
}

export async function getGroups() {
  const snapshot = await getGroupSnapshots();

  return snapshot.docs.map((doc) => doc.data());
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

export async function updateGroup(id: string, data: Group) {
  const docRef = getGroupRefById(id);

  await updateDoc(docRef, data);
}

export async function createGroup(data: Omit<Group, 'id'>) {
  const ref = await addDoc(collection(db, COLLECTION_NAME.GROUPS), data);

  return ref;
}

export async function deleteGroup(id: string) {
  const docRef = getGroupRefById(id);

  await deleteDoc(docRef);
}
