import { db } from '@/firebase/config';
import UserChat, { userChatConverter } from '@/models/userChat';
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

export function getUserChatsRef(): CollectionReference<UserChat> {
  return collection(db, COLLECTION_NAME.USER_CHATS).withConverter(
    userChatConverter
  );
}

export function getUserChatRefByUid(uid: string): DocumentReference<UserChat> {
  return doc(getUserChatsRef(), uid).withConverter(userChatConverter);
}

export async function getUserChatSnapshots(): Promise<QuerySnapshot<UserChat>> {
  const collectionRef = getUserChatsRef();
  return await getDocs(collectionRef);
}

export async function getUserChats(): Promise<UserChat[]> {
  const snapshot = await getUserChatSnapshots();

  return snapshot.docs.map((doc) => doc.data());
}

export async function getUserChatSnapshot(
  uid: string
): Promise<DocumentSnapshot<UserChat>> {
  return await getDoc(getUserChatRefByUid(uid));
}

export async function getUserChat(uid: string): Promise<UserChat | undefined> {
  return (await getUserChatSnapshot(uid)).data();
}

// const unsub = onSnapshot(getUserChatRefByUid('uid'), (doc) => {
//   console.log('Current data: ', doc.data());
// });

export async function updateUserChat(
  uid: string,
  data: Omit<UserChat, 'uid'>
): Promise<void> {
  await updateDoc(getUserChatRefByUid(uid), data);
}

export async function createUserChat(data: UserChat) {
  return await setDoc(
    doc(db, COLLECTION_NAME.USER_CHATS, data.uid).withConverter(
      userChatConverter
    ),
    data
  );
}

export async function deleteUserChat(uid: string): Promise<void> {
  await deleteDoc(getUserChatRefByUid(uid));
}
