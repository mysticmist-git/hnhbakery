import { db } from '@/firebase/config';
import Bill, { billConverter } from '@/models/bill';
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

async function getBills() {
  try {
    const collectionRef = collection(db, COLLECTION_NAME.BILLS).withConverter(
      billConverter
    );

    const snapshot = await getDocs(collectionRef);

    const data = snapshot.docs.map((doc) => doc.data());

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

async function getBillById(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.BILLS, id).withConverter(
      billConverter
    );

    const snapshot = await getDoc(docRef);

    return snapshot.data();
  } catch (error) {
    console.log('[DAO] Fail to get doc', error);
  }
}

async function updateBill(id: string, data: Bill) {
  try {
    const docRef = doc(db, COLLECTION_NAME.BILLS, id).withConverter(
      billConverter
    );

    await updateDoc(docRef, data);
  } catch (error) {
    console.log('[DAO] Fail to update doc', error);
  }
}

async function createBill(data: Bill) {
  try {
    await addDoc(collection(db, COLLECTION_NAME.BILLS), data);
  } catch (error) {
    console.log('[DAO] Fail to create doc', error);
  }
}

async function deleteBill(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.BILLS, id).withConverter(
      billConverter
    );

    await deleteDoc(docRef);
  } catch (error) {
    console.log('[DAO] Fail to delete doc', error);
  }
}

export { createBill, deleteBill, getBillById, getBills, updateBill };
