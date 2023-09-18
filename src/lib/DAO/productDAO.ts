import { db } from '@/firebase/config';
import Product, { productConverter } from '@/models/product';
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

async function getProducts() {
  try {
    const collectionRef = collection(
      db,
      COLLECTION_NAME.PRODUCTS
    ).withConverter(productConverter);

    const snapshot = await getDocs(collectionRef);

    const data = snapshot.docs.map((doc) => doc.data());

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

async function getProductById(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.PRODUCTS, id).withConverter(
      productConverter
    );

    const snapshot = await getDoc(docRef);

    return snapshot.data();
  } catch (error) {
    console.log('[DAO] Fail to get doc', error);
  }
}

async function updateProduct(id: string, data: Product) {
  try {
    const docRef = doc(db, COLLECTION_NAME.PRODUCTS, id).withConverter(
      productConverter
    );

    await updateDoc(docRef, data);
  } catch (error) {
    console.log('[DAO] Fail to update doc', error);
  }
}

async function createProduct(data: Product) {
  try {
    await addDoc(collection(db, COLLECTION_NAME.PRODUCTS), data);
  } catch (error) {
    console.log('[DAO] Fail to create doc', error);
  }
}

async function deleteProduct(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.PRODUCTS, id).withConverter(
      productConverter
    );

    await deleteDoc(docRef);
  } catch (error) {
    console.log('[DAO] Fail to delete doc', error);
  }
}

export {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
};
