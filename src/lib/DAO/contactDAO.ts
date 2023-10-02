import { db } from '@/firebase/config';
import Contact, { contactConverter } from '@/models/contact';
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

export function getContactsRef() {
  return collection(db, COLLECTION_NAME.CONTACTS).withConverter(
    contactConverter
  );
}

export function getContactsRefWithQuery(
  ...queryConstraints: QueryConstraint[]
) {
  return query(getContactsRef(), ...queryConstraints).withConverter(
    contactConverter
  );
}

export function getContactRefById(id: string) {
  return doc(getContactsRef(), id).withConverter(contactConverter);
}

export async function getContactsSnapshot() {
  return await getDocs(getContactsRef());
}

export async function getContactsSnapshotWithQuery(
  ...queryConstraints: QueryConstraint[]
) {
  return await getDocs(getContactsRefWithQuery(...queryConstraints));
}

export async function getContactSnapshotById(id: string) {
  return await getDoc(getContactRefById(id));
}

export async function getContacts() {
  return (await getContactsSnapshot()).docs.map((doc) => doc.data());
}

export async function getContactsWithQuery(
  ...queryConstraints: QueryConstraint[]
) {
  return (await getContactsSnapshotWithQuery(...queryConstraints)).docs.map(
    (doc) => doc.data()
  );
}

export async function getContactById(id: string) {
  return (await getContactSnapshotById(id)).data();
}

export async function updateContact(id: string, data: Contact) {
  await updateDoc(getContactRefById(id), data);
}

export async function createContact(data: Omit<Contact, 'id'>) {
  await addDoc(getContactsRef(), data);
}

export async function deleteContact(id: string) {
  await deleteDoc(getContactRefById(id));
}
