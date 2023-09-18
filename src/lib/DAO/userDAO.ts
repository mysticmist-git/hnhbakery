import { db } from '@/firebase/config';
import User, { userConverter } from '@/models/user';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';
import { getGroupSnapshots } from './groupDAO';

async function getDefaultUsers() {
  try {
    const collectionRef = collection(
      db,
      COLLECTION_NAME.DEFAULT_USERS
    ).withConverter(userConverter);

    const snapshot = await getDocs(collectionRef);

    const data = snapshot.docs.map((doc) => doc.data());

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

async function getUsersByGroup(groupId: string) {
  try {
    const collectionRef = collection(
      db,
      COLLECTION_NAME.GROUPS,
      groupId,
      COLLECTION_NAME.USERS
    ).withConverter(userConverter);

    const snapshot = await getDocs(collectionRef);

    const data = snapshot.docs.map((doc) => doc.data());

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

/**
 * Retrieves a user by their ID.
 *
 * IMPORTANT: This only works if you've already know where is it stored.
 *
 * @param {string} id - The ID of the user.
 * @param {string} [groupId] - The ID of the group the user belongs to (optional).
 * @return {Promise<User>} - A promise that resolves with the user data.
 */
async function getUserById(id: string, groupId?: string) {
  try {
    let docRef;

    if (groupId) {
      docRef = doc(
        db,
        COLLECTION_NAME.GROUPS,
        groupId,
        COLLECTION_NAME.USERS,
        id
      ).withConverter(userConverter);
    } else {
      docRef = doc(db, COLLECTION_NAME.DEFAULT_USERS, id).withConverter(
        userConverter
      );
    }

    const snapshot = await getDoc(docRef);

    return snapshot.data();
  } catch (error) {
    console.log('[DAO] Fail to get doc', error);
  }
}

async function getUserByUid(uid: string) {
  try {
    let docRef;

    // Find user in default users collection
    const defaultUsersQuery = query(
      collection(db, COLLECTION_NAME.DEFAULT_USERS),
      where('uid', '==', uid)
    );

    const defaultUsersSnapshot = await getDocs(defaultUsersQuery);

    if (defaultUsersSnapshot.docs.length > 0) {
      return defaultUsersSnapshot.docs[0].data();
    }

    // Find user in group users collection
    const groups = await getGroupSnapshots();

    for (const group of groups!.docs) {
      const groupUsersQuery = query(
        collection(group.ref, COLLECTION_NAME.USERS),
        where('uid', '==', uid)
      );

      const groupUsersSnapshot = await getDocs(groupUsersQuery);

      if (groupUsersSnapshot.docs.length > 0) {
        return groupUsersSnapshot.docs[0].data();
      }
    }

    throw new Error('User not found');
  } catch (error) {
    console.log('[DAO] Fail to get doc', error);
  }
}

async function updateUser(id: string, data: User, groupId?: string) {
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

async function createUser(data: Omit<User, 'id'>, groupId?: string) {
  try {
    if (groupId) {
      await addDoc(
        collection(db, COLLECTION_NAME.GROUPS, groupId, COLLECTION_NAME.USERS),
        data
      );
    } else {
      await addDoc(collection(db, COLLECTION_NAME.DEFAULT_USERS), data);
    }
  } catch (error) {
    console.log('[DAO] Fail to create doc', error);
  }
}

async function deleteUser(id: string, groupId?: string) {
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

export {
  createUser,
  deleteUser,
  getDefaultUsers,
  getUserById,
  getUserByUid,
  getUsersByGroup,
  updateUser,
};
