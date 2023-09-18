import { db } from '@/firebase/config';
import Group, { groupConverter } from '@/models/group';
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

async function getGroups() {
  try {
    const collectionRef = collection(db, COLLECTION_NAME.GROUPS).withConverter(
      groupConverter
    );

    const snapshot = await getDocs(collectionRef);

    const data = snapshot.docs.map((doc) => doc.data());

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

async function getGroupById(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.GROUPS, id).withConverter(
      groupConverter
    );

    const snapshot = await getDoc(docRef);

    return snapshot.data();
  } catch (error) {
    console.log('[DAO] Fail to get doc', error);
  }
}

async function updateGroup(id: string, data: Group) {
  try {
    const docRef = doc(db, COLLECTION_NAME.GROUPS, id).withConverter(
      groupConverter
    );

    await updateDoc(docRef, data);
  } catch (error) {
    console.log('[DAO] Fail to update doc', error);
  }
}

async function createGroup(data: Group) {
  try {
    await addDoc(collection(db, COLLECTION_NAME.GROUPS), data);
  } catch (error) {
    console.log('[DAO] Fail to create doc', error);
  }
}

async function deleteGroup(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.GROUPS, id).withConverter(
      groupConverter
    );

    await deleteDoc(docRef);
  } catch (error) {
    console.log('[DAO] Fail to delete doc', error);
  }
}

export { createGroup, deleteGroup, getGroupById, getGroups, updateGroup };
