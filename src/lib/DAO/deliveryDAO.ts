import { db } from '@/firebase/config';
import Delivery, { deliveryConverter } from '@/models/delivery';
import {
  DocumentReference,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';

export function getDeliveriesRef() {
  return collection(db, COLLECTION_NAME.DELIVERIES).withConverter(
    deliveryConverter
  );
}

export function getDeliveryRefById(id: string) {
  return doc(db, COLLECTION_NAME.DELIVERIES, id).withConverter(
    deliveryConverter
  );
}

export async function getDeliveriesSnapshot() {
  return await getDocs(getDeliveriesRef());
}

export async function getDeliveries() {
  return (await getDeliveriesSnapshot()).docs.map((doc) => doc.data());
}

export async function getDeliverySnapshotById(id: string) {
  return await getDoc(getDeliveryRefById(id));
}

export async function getDeliveryById(id: string) {
  return (await getDeliverySnapshotById(id)).data();
}

export async function createDelivery(data: Omit<Delivery, 'id'>) {
  const docRef = await addDoc(getDeliveriesRef(), data);
  return docRef.id;
}

export async function updateDelivery(id: string, data: Delivery): Promise<void>;
export async function updateDelivery(
  docRef: DocumentReference<Delivery>,
  data: Delivery
): Promise<void>;
export async function updateDelivery(
  arg: string | DocumentReference<Delivery>,
  data: Delivery
): Promise<void> {
  if (typeof arg === 'string') {
    await updateDoc(getDeliveryRefById(arg), data);
  } else {
    await updateDoc(arg, data);
  }
}

export async function deleteDelivery(id: string): Promise<void>;
export async function deleteDelivery(
  docRef: DocumentReference<Delivery>
): Promise<void>;
export async function deleteDelivery(
  arg: string | DocumentReference<Delivery>
): Promise<void> {
  if (typeof arg === 'string') {
    await deleteDoc(getDeliveryRefById(arg));
  } else {
    await deleteDoc(arg);
  }
}
