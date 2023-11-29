import { db } from '@/firebase/config';
import Group, { GroupTableRow, groupConverter } from '@/models/group';
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
import { getUsers } from './userDAO';

export const DEFAULT_GROUP_ID = 'default';
export const MANAGER_GROUP_ID = 'vn01AtyWFcteKd4OJsCa';
export const DEV_GROUP_ID = 'hMlMMgbIA4RRX0NBTcfO';
export const GUEST_ID = '5Vrj7Nx6O0LrqDbbzRkF';

export function getGroupsRef(): CollectionReference<Group> {
  return collection(db, COLLECTION_NAME.GROUPS).withConverter(groupConverter);
}

export function getGroupsRefWithQuery(
  ...queryConstraints: QueryConstraint[]
): Query<Group> {
  return query(getGroupsRef(), ...queryConstraints);
}

export function getGroupRefById(id: string): DocumentReference<Group> {
  return doc(getGroupsRef(), id);
}

export async function getGroupsSnapshot(): Promise<QuerySnapshot<Group>> {
  const collectionRef = getGroupsRef();

  return await getDocs(collectionRef);
}

export async function getGroups(): Promise<Group[]> {
  const snapshot = await getGroupsSnapshot();

  return snapshot.docs.map((doc) => doc.data());
}

export async function getGroupsSnapshotWithQuery(
  ...queryConstraints: QueryConstraint[]
): Promise<QuerySnapshot<Group>> {
  const collectionRef = getGroupsRefWithQuery(...queryConstraints);

  return await getDocs(collectionRef);
}

export async function getGroupsWithQuery(
  ...queryConstraints: QueryConstraint[]
): Promise<Group[]> {
  return (await getGroupsSnapshotWithQuery(...queryConstraints)).docs.map(
    (doc) => doc.data()
  );
}

export async function getGroupSnapshotById(
  id: string
): Promise<DocumentSnapshot<Group>> {
  return await getDoc(getGroupRefById(id));
}

export async function getGroupById(id: string): Promise<Group | undefined> {
  const snapshot = await getGroupSnapshotById(id);

  return snapshot.data();
}

export async function getDefaultGroupSnapshot(): Promise<
  DocumentSnapshot<Group>
> {
  return await getGroupSnapshotById(DEFAULT_GROUP_ID);
}

export async function getDefaultGroup(): Promise<Group | undefined> {
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

export async function createGroup(
  data: Omit<Group, 'id'>
): Promise<DocumentReference<Group>> {
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

export const getGroupTableRows = async () => {
  try {
    const finalData: GroupTableRow[] = [];
    const grs = await getGroups();
    for (let g of grs) {
      const users = await getUsers(g.id);
      finalData.push({
        ...g,
        users,
      });
    }
    return finalData;
  } catch (error) {
    console.log(error);
    return [];
  }
};
