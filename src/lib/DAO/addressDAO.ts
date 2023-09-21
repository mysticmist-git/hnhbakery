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
import { getUserRef } from './userDAO';

export function getAddressesRef(groupId: string, userId: string) {
  const userRef = getUserRef(groupId, userId);

  return collection(userRef, COLLECTION_NAME.ADDRESSES);
}

export function getAddressRefById(groupId: string, userId: string, id: string) {
  return doc(getAddressesRef(groupId, userId), id);
}

export async function getAddressesSnapshot(groupId: string, userId: string) {
  return await getDocs(getAddressesRef(groupId, userId));
}

export async function getAddresses(groupId: string, userId: string) {
  return (await getAddressesSnapshot(groupId, userId)).docs.map((doc) =>
    doc.data()
  );
}

export async function getAddressSnapshotById(
  groupId: string,
  userId: string,
  id: string
) {
  return getDoc(getAddressRefById(groupId, userId, id));
}

export async function getAddressById(
  groupId: string,
  userId: string,
  id: string
) {
  return (await getAddressSnapshotById(groupId, userId, id)).data();
}

export async function createAddress(
  groupId: string,
  userId: string,
  data: any
) {
  const docRef = await addDoc(getAddressesRef(groupId, userId), data);

  return docRef;
}

export async function updateAddress(
  groupId: string,
  userId: string,
  id: string,
  data: any
) {
  const docRef = getAddressRefById(groupId, userId, id);

  await updateDoc(docRef, data);
}

export async function deleteAddress(
  groupId: string,
  userId: string,
  id: string
) {
  await deleteDoc(getAddressRefById(groupId, userId, id));
}
