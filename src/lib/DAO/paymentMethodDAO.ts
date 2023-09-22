import { db } from '@/firebase/config';
import PaymentMethod, { paymentMethodConverter } from '@/models/paymentMethod';
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

export async function updatePaymentMethod(
  id: string,
  data: PaymentMethod
): Promise<void>;
export async function updatePaymentMethod(
  paymentMethodRef: DocumentReference<PaymentMethod>,
  data: PaymentMethod
): Promise<void>;
export async function updatePaymentMethod(
  arg1: string | DocumentReference<PaymentMethod>,
  arg2: PaymentMethod
): Promise<void> {
  if (typeof arg1 === 'string') {
    const id = arg1;
    const data = arg2;

    await updateDoc(getPaymentMethodRefById(id), data);
  } else {
    const docRef = arg1;
    const data = arg2;

    await updateDoc(docRef, data);
  }
}

export async function deletePaymentMethod(id: string): Promise<void>;
export async function deletePaymentMethod(
  docRef: DocumentReference<PaymentMethod>
): Promise<void>;
export async function deletePaymentMethod(
  arg: string | DocumentReference<PaymentMethod>
): Promise<void> {
  if (typeof arg === 'string') {
    await deleteDoc(getPaymentMethodRefById(arg));
  } else {
    await deleteDoc(arg);
  }
}
