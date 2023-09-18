import { db } from '@/firebase/config';
import Address, { addressConverter } from '@/models/address';
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

async function getAddresses() {
  try {
    const collectionRef = collection(
      db,
      COLLECTION_NAME.ADDRESSES
    ).withConverter(addressConverter);

    const snapshot = await getDocs(collectionRef);

    const data = snapshot.docs.map((doc) => doc.data());

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

async function getAddressById(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.ADDRESSES, id).withConverter(
      addressConverter
    );

    const snapshot = await getDoc(docRef);

    return snapshot.data();
  } catch (error) {
    console.log('[DAO] Fail to get doc', error);
  }
}

async function updateAddress(id: string, data: Address) {
  try {
    const docRef = doc(db, COLLECTION_NAME.ADDRESSES, id).withConverter(
      addressConverter
    );

    await updateDoc(docRef, data);
  } catch (error) {
    console.log('[DAO] Fail to update doc', error);
  }
}

async function createAddress(data: Address) {
  try {
    await addDoc(collection(db, COLLECTION_NAME.ADDRESSES), data);
  } catch (error) {
    console.log('[DAO] Fail to create doc', error);
  }
}

async function deleteAddress(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.ADDRESSES, id).withConverter(
      addressConverter
    );

    await deleteDoc(docRef);
  } catch (error) {
    console.log('[DAO] Fail to delete doc', error);
  }
}

export {
  createAddress,
  deleteAddress,
  getAddressById,
  getAddresses,
  updateAddress,
};
