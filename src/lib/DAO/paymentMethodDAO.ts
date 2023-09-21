import { db } from '@/firebase/config';
import PaymentMethod, { paymentMethodConverter } from '@/models/paymentMethod';
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

export function getPaymentMethodsRef() {
  return collection(db, COLLECTION_NAME.PAYMENT_METHODS).withConverter(
    paymentMethodConverter
  );
}

export function getPaymentMethodRefById(id: string) {
  return doc(getPaymentMethodsRef(), id);
}

export async function getPaymentMethodsSnapshot() {
  return await getDocs(getPaymentMethodsRef());
}

export async function getPaymentMethods() {
  return (await getPaymentMethodsSnapshot()).docs.map((doc) => doc.data());
}

export async function getPaymentMethodSnapshotById(id: string) {
  return await getDoc(getPaymentMethodRefById(id));
}

export async function getPaymentMethodById(id: string) {
  return (await getPaymentMethodSnapshotById(id)).data();
}

export async function createPaymentMethod(data: Omit<PaymentMethod, 'id'>) {
  return await addDoc(getPaymentMethodsRef(), data);
}

export async function updatePaymentMethod(id: string, data: PaymentMethod) {
  await updateDoc(getPaymentMethodRefById(id), data);
}

export async function deletePaymentMethod(id: string) {
  await deleteDoc(getPaymentMethodRefById(id));
}
