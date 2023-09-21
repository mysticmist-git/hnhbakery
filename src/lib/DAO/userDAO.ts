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
  getGroupRefById,
  getGroupSnapshots,
} from './groupDAO';

export function getUsersRefByGroup(groupId: string) {
  return collection(
    getGroupRefById(groupId),
    COLLECTION_NAME.USERS
  ).withConverter(userConverter);
}

export function getUsersByGroupWithQuery(
  groupId: string,
  ...queryConstraints: QueryConstraint[]
) {
  return getDocs(
    query(getUsersRefByGroup(groupId), ...queryConstraints).withConverter(
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
  return await getDocs(query(getUsersRefByGroup(groupId), ...queryConstraints));
}

export async function getUsersSnapshotByGroup(groupId: string) {
  return await getDocs(getUsersRefByGroup(groupId));
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
    const matchUsers = await getUsersByGroupWithQuery(groupSnapshot.id);

    if (matchUsers.empty) continue;

    const user = matchUsers.docs[0].data();

    return user;
  }
}

export async function updateUser(id: string, data: User, groupId?: string) {
  try {
    if (groupId) {
      await updateDoc(
        doc(
          db,
          COLLECTION_NAME.GROUPS,
          groupId,
          COLLECTION_NAME.USERS,
          id
        ).withConverter(userConverter),
        data
      );
    } else {
      await updateDoc(
        doc(db, COLLECTION_NAME.DEFAULT_USERS, id).withConverter(userConverter),
        data
      );
    }
  } catch (error) {
    console.log('[DAO] Fail to update doc', error);
  }
}

export async function createUser(data: Omit<User, 'id'>, groupId?: string) {
  try {
    await addDoc(
      collection(
        db,
        COLLECTION_NAME.GROUPS,
        groupId ? groupId : 'default',
        COLLECTION_NAME.USERS
      ),
      data
    );
  } catch (error) {
    console.log('[DAO] Fail to create doc', error);
  }
}

export async function deleteUser(id: string, groupId?: string) {
  try {
    if (groupId) {
      await deleteDoc(
        doc(db, COLLECTION_NAME.GROUPS, groupId, COLLECTION_NAME.USERS, id)
      );
    } else {
      await deleteDoc(doc(db, COLLECTION_NAME.DEFAULT_USERS, id));
    }
  } catch (error) {
    console.log('[DAO] Fail to delete doc', error);
  }
}
