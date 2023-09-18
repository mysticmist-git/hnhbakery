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

async function getPaymentMethods() {
  try {
    const collectionRef = collection(
      db,
      COLLECTION_NAME.PAYMENT_METHODS
    ).withConverter(paymentMethodConverter);

    const snapshot = await getDocs(collectionRef);

    const data = snapshot.docs.map((doc) => doc.data());

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

async function getPaymentMethodById(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.PAYMENT_METHODS, id).withConverter(
      paymentMethodConverter
    );

    const snapshot = await getDoc(docRef);

    return snapshot.data();
  } catch (error) {
    console.log('[DAO] Fail to get doc', error);
  }
}

async function updatePaymentMethod(id: string, data: PaymentMethod) {
  try {
    const docRef = doc(db, COLLECTION_NAME.PAYMENT_METHODS, id).withConverter(
      paymentMethodConverter
    );

    await updateDoc(docRef, data);
  } catch (error) {
    console.log('[DAO] Fail to update doc', error);
  }
}

async function createPaymentMethod(data: PaymentMethod) {
  try {
    await addDoc(collection(db, COLLECTION_NAME.PAYMENT_METHODS), data);
  } catch (error) {
    console.log('[DAO] Fail to create doc', error);
  }
}

async function deletePaymentMethod(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.PAYMENT_METHODS, id).withConverter(
      paymentMethodConverter
    );

    await deleteDoc(docRef);
  } catch (error) {
    console.log('[DAO] Fail to delete doc', error);
  }
}

export {
  createPaymentMethod,
  deletePaymentMethod,
  getPaymentMethodById,
  getPaymentMethods,
  updatePaymentMethod,
};
