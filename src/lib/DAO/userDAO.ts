import { db } from '@/firebase/config';
import User, { userConverter } from '@/models/user';
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
import {
  DEFAULT_GROUP_ID,
  getGroupById,
  getGroupRefById,
  getGroupSnapshots,
} from './groupDAO';

export function getUsersRef(groupId: string) {
  return collection(
    getGroupRefById(groupId),
    COLLECTION_NAME.USERS
  ).withConverter(userConverter);
}

export function getUsersRefWithQuery(
  groupId: string,
  ...queryConstraints: QueryConstraint[]
) {
  return getDocs(
    query(getUsersRef(groupId), ...queryConstraints).withConverter(
      userConverter
    )
  );
}

export function getUserRefById(groupId: string, id: string) {
  return doc(getGroupRefById(groupId), id).withConverter(userConverter);
}

export async function queryUsersByGroup(
  groupId: string,
  ...queryConstraints: QueryConstraint[]
) {
  return await getDocs(query(getUsersRef(groupId), ...queryConstraints));
}

export async function getUsersSnapshotByGroup(groupId: string) {
  return await getDocs(getUsersRef(groupId));
}

export async function getUsersByGroup(groupId: string) {
  return (await getUsersSnapshotByGroup(groupId)).docs.map((doc) => doc.data());
}

export async function getDefaultUsersSnapshot() {
  return await getUsersSnapshotByGroup(DEFAULT_GROUP_ID);
}

export async function getDefaultUsers() {
  return await getUsersByGroup(DEFAULT_GROUP_ID);
}

export async function getUserSnapshotById(groupId: string, id: string) {
  return await getDoc(getUserRefById(groupId, id));
}

export async function getUserById(groupId: string, id: string) {
  return (await getUserSnapshotById(groupId, id)).data();
}

export async function getUserByUid(uid: string) {
  const groupsSnapshot = await getGroupSnapshots();

  for (let groupSnapshot of groupsSnapshot.docs) {
    const matchUsers = await getUsersRefWithQuery(groupSnapshot.id);

    if (matchUsers.empty) continue;

    const user = matchUsers.docs[0].data();

    return user;
  }
}

export async function updateUser(groupId: string, id: string, data: User) {
  const docRef = getUserRefById(groupId, id);

  await updateDoc(docRef, data);
}

export async function createUser(groupId: string, data: User) {
  const docRef = await addDoc(getUsersRef(groupId), data);

  return docRef;
}

export async function deleteUser(groupId: string, id: string) {
  await deleteDoc(getUserRefById(groupId, id));
}
