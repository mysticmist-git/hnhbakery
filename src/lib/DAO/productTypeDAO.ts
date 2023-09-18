import { db } from '@/firebase/config';
import ProductType, { productTypeConverter } from '@/models/productType';
import {
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';

async function getProductTypes() {
  try {
    const collectionRef = collection(
      db,
      COLLECTION_NAME.PRODUCT_TYPES
    ).withConverter(productTypeConverter);

    const snapshot = await getDocs(collectionRef);

    const data = snapshot.docs.map((doc) => doc.data());

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

async function getProductTypeById(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.PRODUCT_TYPES, id).withConverter(
      productTypeConverter
    );

    const snapshot = await getDoc(docRef);

    return snapshot.data();
  } catch (error) {
    console.log('[DAO] Fail to get doc', error);
  }
}

async function updateProductType(id: string, data: ProductType) {
  try {
    const docRef = doc(db, COLLECTION_NAME.PRODUCT_TYPES, id).withConverter(
      productTypeConverter
    );

    await updateDoc(docRef, data);
  } catch (error) {
    console.log('[DAO] Fail to update doc', error);
  }
}

async function createProductType(data: ProductType) {
  try {
    await addDoc(collection(db, COLLECTION_NAME.PRODUCT_TYPES), data);
  } catch (error) {
    console.log('[DAO] Fail to create doc', error);
  }
}

async function deleteProductType(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.PRODUCT_TYPES, id).withConverter(
      productTypeConverter
    );

    await deleteDoc(docRef);
  } catch (error) {
    console.log('[DAO] Fail to delete doc', error);
  }
}

export {
  createProductType,
  deleteProductType,
  getProductTypeById,
  getProductTypes,
  updateProductType,
};
