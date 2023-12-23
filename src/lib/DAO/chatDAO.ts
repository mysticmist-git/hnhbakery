import { db } from '@/firebase/config';
import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';
import Chat, { chatConverter } from '@/models/chat';

export function getChatsRef(): CollectionReference<Chat> {
  return collection(db, COLLECTION_NAME.CHATS).withConverter(chatConverter);
}

export function getChatRefById(id: string): DocumentReference<Chat> {
  return doc(getChatsRef(), id).withConverter(chatConverter);
}

export async function getChatSnapshots(): Promise<QuerySnapshot<Chat>> {
  const collectionRef = getChatsRef();
  return await getDocs(collectionRef);
}

export async function getChats(): Promise<Chat[]> {
  const snapshot = await getChatSnapshots();
  return snapshot.docs.map((doc) => doc.data());
}

export async function getChatSnapshot(
  id: string
): Promise<DocumentSnapshot<Chat>> {
  return await getDoc(getChatRefById(id));
}

export async function getChat(id: string): Promise<Chat | undefined> {
  return (await getChatSnapshot(id)).data();
}

// const unsub = onSnapshot(getChatRefById(''), (doc) => {
//   console.log('Current data: ', doc.data());
// });

export async function updateChat(
  id: string,
  data: Omit<Chat, 'id'>
): Promise<void> {
  await updateDoc(getChatRefById(id), data);
}

export async function createChat(data: Chat) {
  return await setDoc(
    doc(db, COLLECTION_NAME.CHATS, data.id).withConverter(chatConverter),
    data
  );
}

export async function deleteChat(id: string): Promise<void> {
  await deleteDoc(getChatRefById(id));
}
