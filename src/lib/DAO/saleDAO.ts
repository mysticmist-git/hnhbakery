import { db } from '@/firebase/config';
import Sale from '@/models/sale';
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
import { saleConverter } from '../models';

async function getSales() {
  try {
    const collectionRef = collection(db, COLLECTION_NAME.SALES).withConverter(
      saleConverter
    );

    const snapshot = await getDocs(collectionRef);

    const data = snapshot.docs.map((doc) => doc.data());

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

async function getSaleById(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.SALES, id).withConverter(
      saleConverter
    );

    const snapshot = await getDoc(docRef);

    return snapshot.data();
  } catch (error) {
    console.log('[DAO] Fail to get doc', error);
  }
}

async function updateSale(id: string, data: Sale) {
  try {
    const docRef = doc(db, COLLECTION_NAME.SALES, id).withConverter(
      saleConverter
    );

    await updateDoc(docRef, data);
  } catch (error) {
    console.log('[DAO] Fail to update doc', error);
  }
}

async function createSale(data: Sale) {
  try {
    await addDoc(collection(db, COLLECTION_NAME.SALES), data);
  } catch (error) {
    console.log('[DAO] Fail to create doc', error);
  }
}

async function deleteSale(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.SALES, id).withConverter(
      saleConverter
    );

    await deleteDoc(docRef);
  } catch (error) {
    console.log('[DAO] Fail to delete doc', error);
  }
}

export { createSale, deleteSale, getSaleById, getSales, updateSale };
