import { db } from '@/firebase/config';
import Contact, { contactConverter } from '@/models/contact';
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

async function getContacts() {
  try {
    const collectionRef = collection(
      db,
      COLLECTION_NAME.CONTACTS
    ).withConverter(contactConverter);

    const snapshot = await getDocs(collectionRef);

    const data = snapshot.docs.map((doc) => doc.data());

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

async function getContactById(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.CONTACTS, id).withConverter(
      contactConverter
    );

    const snapshot = await getDoc(docRef);

    return snapshot.data();
  } catch (error) {
    console.log('[DAO] Fail to get doc', error);
  }
}

async function updateContact(id: string, data: Contact) {
  try {
    const docRef = doc(db, COLLECTION_NAME.CONTACTS, id).withConverter(
      contactConverter
    );

    await updateDoc(docRef, data);
  } catch (error) {
    console.log('[DAO] Fail to update doc', error);
  }
}

async function createContact(data: Contact) {
  try {
    await addDoc(collection(db, COLLECTION_NAME.CONTACTS), data);
  } catch (error) {
    console.log('[DAO] Fail to create doc', error);
  }
}

async function deleteContact(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.CONTACTS, id).withConverter(
      contactConverter
    );

    await deleteDoc(docRef);
  } catch (error) {
    console.log('[DAO] Fail to delete doc', error);
  }
}

export {
  createContact,
  deleteContact,
  getContactById,
  getContacts,
  updateContact,
};
