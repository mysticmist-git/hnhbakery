import { db } from '@/firebase/config';
import CustomerRank, { customerRankConverter } from '@/models/customerRank';
import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';

export function getCustomerRanksRef(): CollectionReference<CustomerRank> {
  return collection(db, COLLECTION_NAME.CUSTOMER_RANKS).withConverter(
    customerRankConverter
  );
}

export function getCustomerRankRefById(
  id: string
): DocumentReference<CustomerRank> {
  return doc(getCustomerRanksRef(), id).withConverter(customerRankConverter);
}

export async function getCustomerRankSnapshots(): Promise<
  QuerySnapshot<CustomerRank>
> {
  const collectionRef = getCustomerRanksRef();
  return await getDocs(collectionRef);
}

export async function getCustomerRanks(): Promise<CustomerRank[]> {
  const snapshot = await getCustomerRankSnapshots();
  return snapshot.docs.map((doc) => doc.data());
}

export async function getCustomerRankSnapshot(
  id: string
): Promise<DocumentSnapshot<CustomerRank>> {
  return await getDoc(getCustomerRankRefById(id));
}
export async function getCustomerRank(
  id: string
): Promise<CustomerRank | undefined> {
  return (await getCustomerRankSnapshot(id)).data();
}

export async function updateCustomerRank(
  id: string,
  data: Omit<CustomerRank, 'id'>
): Promise<void> {
  await updateDoc(getCustomerRankRefById(id), data);
}

export async function createCustomerRank(data: CustomerRank) {
  return await setDoc(
    doc(db, COLLECTION_NAME.CHATS, data.id).withConverter(
      customerRankConverter
    ),
    data
  );
}

export async function deleteCustomerRank(id: string): Promise<void> {
  await deleteDoc(getCustomerRankRefById(id));
}
