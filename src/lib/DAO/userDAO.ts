import { db } from '@/firebase/config';
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

async function getUsers() {
  try {
    const collectionRef = collection(db, COLLECTION_NAME.USERS).withConverter(
      userConverter
    );

    const snapshot = await getDocs(collectionRef);

    const data = snapshot.docs.map((doc) => doc.data());

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

async function getUserById(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.USERS, id).withConverter(
      userConverter
    );

    const snapshot = await getDoc(docRef);

    return snapshot.data();
  } catch (error) {
    console.log('[DAO] Fail to get doc', error);
  }
}

async function updateUser(id: string, data: User) {
  try {
    const docRef = doc(db, COLLECTION_NAME.USERS, id).withConverter(
      userConverter
    );

    await updateDoc(docRef, data);
  } catch (error) {
    console.log('[DAO] Fail to update doc', error);
  }
}

async function createUser(data: User) {
  try {
    await addDoc(collection(db, COLLECTION_NAME.USERS), data);
  } catch (error) {
    console.log('[DAO] Fail to create doc', error);
  }
}

async function deleteUser(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.USERS, id).withConverter(
      userConverter
    );

    await deleteDoc(docRef);
  } catch (error) {
    console.log('[DAO] Fail to delete doc', error);
  }
}

export { createUser, deleteUser, getUserById, getUsers, updateUser };
