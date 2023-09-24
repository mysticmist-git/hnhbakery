import { db } from '@/firebase/config';
import Batch, { batchConverter } from '@/models/batch';
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
import { getProductTypeSnapshots } from './productTypeDAO';

// async function getBatches() {
//   try {
//     const collectionRef = collection(db, COLLECTION_NAME.BATCHES).withConverter(
//       batchConverter
//     );

//     const snapshot = await getDocs(collectionRef);

//     const data = snapshot.docs.map((doc) => doc.data());

//     return data;
//   } catch (error) {
//     console.log('[DAO] Fail to get collection', error);
//   }
// }

// async function getBatches() {
//   try {
//     const productTypeSnapshots = await getProductTypeSnapshots();

//     if (!productTypeSnapshots) {
//       return [];
//     }

//     for (const p of productTypeSnapshots.docs) {

//     }
//   } catch (error) {
//     console.log('[DAO] Fail to get collection', error);
//   }
// }

async function getBatchById(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.BATCHES, id).withConverter(
      batchConverter
    );

    const snapshot = await getDoc(docRef);

    return snapshot.data();
  } catch (error) {
    console.log('[DAO] Fail to get doc', error);
  }
}

async function updateBatch(id: string, data: Batch) {
  try {
    const docRef = doc(db, COLLECTION_NAME.BATCHES, id).withConverter(
      batchConverter
    );

    await updateDoc(docRef, data);
  } catch (error) {
    console.log('[DAO] Fail to update doc', error);
  }
}

async function createBatch(data: Batch) {
  try {
    await addDoc(collection(db, COLLECTION_NAME.BATCHES), data);
  } catch (error) {
    console.log('[DAO] Fail to create doc', error);
  }
}

async function deleteBatch(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.BATCHES, id).withConverter(
      batchConverter
    );

    await deleteDoc(docRef);
  } catch (error) {
    console.log('[DAO] Fail to delete doc', error);
  }
}

export { createBatch, deleteBatch, getBatchById, updateBatch };
