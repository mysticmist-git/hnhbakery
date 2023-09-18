import { db } from '@/firebase/config';
import BillItem, { billItemConverter } from '@/models/billItem';
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

async function getBillItems() {
  try {
    const collectionRef = collection(
      db,
      COLLECTION_NAME.BILL_ITEMS
    ).withConverter(billItemConverter);

    const snapshot = await getDocs(collectionRef);

    const data = snapshot.docs.map((doc) => doc.data());

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

async function getBillItemById(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.BILL_ITEMS, id).withConverter(
      billItemConverter
    );

    const snapshot = await getDoc(docRef);

    return snapshot.data();
  } catch (error) {
    console.log('[DAO] Fail to get doc', error);
  }
}

async function updateBillItem(id: string, data: BillItem) {
  try {
    const docRef = doc(db, COLLECTION_NAME.BILL_ITEMS, id).withConverter(
      billItemConverter
    );

    await updateDoc(docRef, data);
  } catch (error) {
    console.log('[DAO] Fail to update doc', error);
  }
}

async function createBillItem(data: BillItem) {
  try {
    await addDoc(collection(db, COLLECTION_NAME.BILL_ITEMS), data);
  } catch (error) {
    console.log('[DAO] Fail to create doc', error);
  }
}

async function deleteBillItem(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.BILL_ITEMS, id).withConverter(
      billItemConverter
    );

    await deleteDoc(docRef);
  } catch (error) {
    console.log('[DAO] Fail to delete doc', error);
  }
}

export {
  createBillItem,
  deleteBillItem,
  getBillItemById,
  getBillItems,
  updateBillItem,
};
