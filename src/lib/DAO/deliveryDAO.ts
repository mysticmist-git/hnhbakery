import { db } from '@/firebase/config';
import Delivery, { deliveryConverter } from '@/models/delivery';
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

async function getDeliveries() {
  try {
    const collectionRef = collection(
      db,
      COLLECTION_NAME.DELIVERIES
    ).withConverter(deliveryConverter);

    const snapshot = await getDocs(collectionRef);

    const data = snapshot.docs.map((doc) => doc.data());

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

async function getDeliveryById(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.DELIVERIES, id).withConverter(
      deliveryConverter
    );

    const snapshot = await getDoc(docRef);

    return snapshot.data();
  } catch (error) {
    console.log('[DAO] Fail to get doc', error);
  }
}

async function updateDelivery(id: string, data: Delivery) {
  try {
    const docRef = doc(db, COLLECTION_NAME.DELIVERIES, id).withConverter(
      deliveryConverter
    );

    await updateDoc(docRef, data);
  } catch (error) {
    console.log('[DAO] Fail to update doc', error);
  }
}

async function createDelivery(data: Delivery) {
  try {
    await addDoc(collection(db, COLLECTION_NAME.DELIVERIES), data);
  } catch (error) {
    console.log('[DAO] Fail to create doc', error);
  }
}

async function deleteDelivery(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.DELIVERIES, id).withConverter(
      deliveryConverter
    );

    await deleteDoc(docRef);
  } catch (error) {
    console.log('[DAO] Fail to delete doc', error);
  }
}

export {
  createDelivery,
  deleteDelivery,
  getDeliveries,
  getDeliveryById,
  updateDelivery,
};
