import Group from '@/models/group';
import User, { userConverter } from '@/models/user';
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
  where,
} from 'firebase/firestore';

import { COLLECTION_NAME } from '../constants';
import {
  DEFAULT_GROUP_ID,
  getGroupRefById,
  getGroupSnapshots,
} from './groupDAO';

export function getUsersRef(
  groupRef: DocumentReference<Group>
): CollectionReference<User>;
export function getUsersRef(groupId: string): CollectionReference<User>;
export function getUsersRef(
  arg: string | DocumentReference<Group>
): CollectionReference<User> {
  if (typeof arg === 'string') {
    return collection(
      getGroupRefById(arg),
      COLLECTION_NAME.USERS
    ).withConverter(userConverter);
  } else {
    return collection(arg, COLLECTION_NAME.USERS).withConverter(userConverter);
  }
}

export function getUsersRefWithQuery(
  groupRef: DocumentReference<Group>,
  ...queryConstraints: QueryConstraint[]
): Query<User>;
export function getUsersRefWithQuery(
  groupId: string,
  ...queryConstraints: QueryConstraint[]
): Query<User>;
export function getUsersRefWithQuery(
  arg: string | DocumentReference<Group>,
  ...queryConstraints: QueryConstraint[]
): Query<User> {
  if (typeof arg === 'string') {
    return query(getUsersRef(arg), ...queryConstraints);
  } else {
    return query(getUsersRef(arg), ...queryConstraints);
  }
}

export function getUserRef(
  groupRef: DocumentReference<Group>,
  id: string
): DocumentReference<User>;
export function getUserRef(
  groupId: string,
  id: string
): DocumentReference<User>;
export function getUserRef(
  arg: string | DocumentReference<Group>,
  id: string
): DocumentReference<User> {
  const groupRef = typeof arg === 'string' ? getGroupRefById(arg) : arg;
  return doc(groupRef, id).withConverter(userConverter);
}

export async function getUsersSnapshot(
  groupId: string
): Promise<QuerySnapshot<User>>;
export async function getUsersSnapshot(
  groupRef: DocumentReference<Group>
): Promise<QuerySnapshot<User>>;

export async function getUsersSnapshot(
  arg: string | DocumentReference<Group>
): Promise<QuerySnapshot<User>> {
  if (typeof arg === 'string') {
    return await getDocs(getUsersRef(arg));
  } else {
    return await getDocs(getUsersRef(arg));
  }
}

export async function getUsers(groupId: string): Promise<User[]>;
export async function getUsers(
  groupRef: DocumentReference<Group>
): Promise<User[]>;
export async function getUsers(
  arg: string | DocumentReference<Group>
): Promise<User[]> {
  if (typeof arg === 'string') {
    return (await getUsersSnapshot(arg)).docs.map((doc) => doc.data());
  } else {
    return (await getUsersSnapshot(arg)).docs.map((doc) => doc.data());
  }
}

export async function getDefaultUsersSnapshot(): Promise<QuerySnapshot<User>> {
  return await getUsersSnapshot(DEFAULT_GROUP_ID);
}

export async function getDefaultUsers(): Promise<User[]> {
  return await getUsers(DEFAULT_GROUP_ID);
}

export async function getUsersSnapshotWithQuery(
  groupId: string,
  ...queryConstraints: QueryConstraint[]
): Promise<QuerySnapshot<User>>;
export async function getUsersSnapshotWithQuery(
  groupRef: DocumentReference<Group>,
  ...queryConstraints: QueryConstraint[]
): Promise<QuerySnapshot<User>>;
export async function getUsersSnapshotWithQuery(
  arg: string | DocumentReference<Group>,
  ...queryConstraints: QueryConstraint[]
): Promise<QuerySnapshot<User>> {
  if (typeof arg === 'string') {
    return await getDocs(getUsersRefWithQuery(arg, ...queryConstraints));
  } else {
    return await getDocs(getUsersRefWithQuery(arg, ...queryConstraints));
  }
}

export async function getUsersWithQuery(
  groupId: string,
  ...queryConstraints: QueryConstraint[]
): Promise<User[]>;
export async function getUsersWithQuery(
  groupRef: DocumentReference<Group>,
  ...queryConstraints: QueryConstraint[]
): Promise<User[]>;
export async function getUsersWithQuery(
  arg: string | DocumentReference<Group>,
  ...queryConstraints: QueryConstraint[]
): Promise<User[]> {
  if (typeof arg === 'string') {
    return (await getUsersSnapshotWithQuery(arg, ...queryConstraints)).docs.map(
      (doc) => doc.data()
    );
  } else {
    return (await getUsersSnapshotWithQuery(arg, ...queryConstraints)).docs.map(
      (doc) => doc.data()
    );
  }
}

export async function getUserSnapshot(
  groupId: string,
  id: string
): Promise<DocumentSnapshot<User>>;
export async function getUserSnapshot(
  groupRef: DocumentReference<Group>,
  id: string
): Promise<DocumentSnapshot<User>>;
export async function getUserSnapshot(
  arg: string | DocumentReference<Group>,
  id: string
): Promise<DocumentSnapshot<User>> {
  if (typeof arg === 'string') {
    return await getDoc(getUserRef(arg, id));
  } else {
    return await getDoc(getUserRef(arg, id));
  }
}

export async function getUser(
  groupId: string,
  id: string
): Promise<User | undefined>;
export async function getUser(
  groupRef: DocumentReference<Group>,
  id: string
): Promise<User | undefined>;
export async function getUser(
  arg: string | DocumentReference<Group>,
  id: string
): Promise<User | undefined> {
  if (typeof arg === 'string') {
    return (await getUserSnapshot(arg, id)).data();
  } else {
    return (await getUserSnapshot(arg, id)).data();
  }
}

export async function getUserByUid(uid: string) {
  const groupsSnapshot = await getGroupSnapshots();

  for (let groupSnapshot of groupsSnapshot.docs) {
    const matchUsers = await getUsersSnapshotWithQuery(
      groupSnapshot.id,
      where('uid', '==', uid)
    );

    if (matchUsers.empty) continue;

    const user = matchUsers.docs[0].data();

    return user;
  }
}

export async function updateUser(
  groupId: string,
  id: string,
  data: User
): Promise<void>;
export async function updateUser(
  groupRef: DocumentReference<Group>,
  id: string,
  data: User
): Promise<void>;
export async function updateUser(
  arg: string | DocumentReference<Group>,
  id: string,
  data: User
): Promise<void> {
  const docRef =
    typeof arg === 'string' ? getUserRef(arg, id) : getUserRef(arg, id);

  await updateDoc(docRef, data);
}

export async function createUser(
  groupId: string,
  data: Omit<User, 'id'>
): Promise<DocumentReference<User>>;
export async function createUser(
  groupRef: DocumentReference<Group>,
  data: Omit<User, 'id'>
): Promise<DocumentReference<User>>;
export async function createUser(
  arg: string | DocumentReference<Group>,
  data: Omit<User, 'id'>
): Promise<DocumentReference<User>> {
  const collectionRef =
    typeof arg === 'string' ? getUsersRef(arg) : getUsersRef(arg);

  return (await addDoc(collectionRef, data)).withConverter(userConverter);
}

export async function deleteUser(groupId: string, id: string): Promise<void>;
export async function deleteUser(
  groupRef: DocumentReference<Group>,
  id: string
): Promise<void>;
export async function deleteUser(
  groupId: string | DocumentReference<Group>,
  id: string
): Promise<void> {
  const docRef =
    typeof groupId === 'string'
      ? getUserRef(groupId, id)
      : getUserRef(groupId, id);

  await deleteDoc(docRef);
}
