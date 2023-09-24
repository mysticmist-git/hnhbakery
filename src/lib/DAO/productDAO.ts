import { db } from '@/firebase/config';
import Product, { productConverter } from '@/models/product';
import {
  QueryDocumentSnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';
import {
  getProductTypeSnapshotById,
  getProductTypeSnapshots,
} from './productTypeDAO';

export async function getProducts() {
  try {
    const productTypeSnapshots = await getProductTypeSnapshots();

    if (!productTypeSnapshots) {
      return [];
    }

    let data: Product[] = [];

    for (const p of productTypeSnapshots) {
      const productsRef = collection(
        p.ref,
        COLLECTION_NAME.PRODUCTS
      ).withConverter(productConverter);
      data.push(...(await getDocs(productsRef)).docs.map((doc) => doc.data()));
    }

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

export async function getProductSnapshots() {
  try {
    const productTypeSnapshots = await getProductTypeSnapshots();

    if (!productTypeSnapshots) {
      return [];
    }

    let data: QueryDocumentSnapshot<Product>[] = [];

    for (const p of productTypeSnapshots) {
      const productsRef = collection(
        p.ref,
        COLLECTION_NAME.PRODUCTS
      ).withConverter(productConverter);
      data.push(...(await getDocs(productsRef)).docs);
    }

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

export async function getProductsByProductType(productTypeId: string) {
  try {
    const productTypeSnapshot = await getProductTypeSnapshotById(productTypeId);
    if (!productTypeSnapshot) {
      return [];
    }
    const collectionRef = collection(
      productTypeSnapshot.ref,
      COLLECTION_NAME.PRODUCTS
    );

    const snapshot = await getDocs(collectionRef);

    const data = snapshot.docs.map((doc) => doc.data());

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

export async function getProductSnapshotsByProductType(productTypeId: string) {
  try {
    const productTypeSnapshot = await getProductTypeSnapshotById(productTypeId);
    if (!productTypeSnapshot) {
      return [];
    }
    const collectionRef = collection(
      productTypeSnapshot.ref,
      COLLECTION_NAME.PRODUCTS
    );

    const snapshot = await getDocs(collectionRef);

    return snapshot.docs;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

export async function getProductById(productTypeId: string, productid: string) {
  try {
    const productTypeSnapshot = await getProductTypeSnapshotById(productTypeId);
    if (!productTypeSnapshot) {
      return;
    }

    const docRef = doc(
      productTypeSnapshot.ref,
      COLLECTION_NAME.PRODUCTS,
      productid
    );

    const snapshot = await getDoc(docRef);

    return snapshot.data();
  } catch (error) {
    console.log('[DAO] Fail to get doc', error);
  }
}

export async function getProductSnapshotById(
  productTypeId: string,
  productid: string
) {
  try {
    const productTypeSnapshot = await getProductTypeSnapshotById(productTypeId);
    if (!productTypeSnapshot) {
      return;
    }

    const docRef = doc(
      productTypeSnapshot.ref,
      COLLECTION_NAME.PRODUCTS,
      productid
    );

    const snapshot = await getDoc(docRef);

    return snapshot;
  } catch (error) {
    console.log('[DAO] Fail to get doc', error);
  }
}

export async function updateProduct(
  productTypeId: string,
  productId: string,
  data: Product
) {
  try {
    const productTypeSnapshot = await getProductTypeSnapshotById(productTypeId);

    // TODO: check if productTypeSnapshot exists
    if (!productTypeSnapshot) {
      return;
    }
    const docRef = doc(
      productTypeSnapshot.ref,
      COLLECTION_NAME.PRODUCTS,
      productId
    ).withConverter(productConverter);

    await updateDoc(docRef, data);
  } catch (error) {
    console.log('[DAO] Fail to update doc', error);
  }
}

export async function createProduct(productTypeId: string, data: Product) {
  try {
    const productTypeSnapshot = await getProductTypeSnapshotById(productTypeId);
    // TODO: check if productTypeSnapshot exists
    if (!productTypeSnapshot) {
      return;
    }
    await addDoc(
      collection(productTypeSnapshot.ref, COLLECTION_NAME.PRODUCTS),
      data
    );
  } catch (error) {
    console.log('[DAO] Fail to create doc', error);
  }
}

export async function deleteProduct(productTypeId: string, productId: string) {
  try {
    const productTypeSnapshot = await getProductTypeSnapshotById(productTypeId);
    // TODO: check if productTypeSnapshot exists
    if (!productTypeSnapshot) {
      return;
    }

    const docRef = doc(
      productTypeSnapshot.ref,
      COLLECTION_NAME.PRODUCTS,
      productId
    ).withConverter(productConverter);

    await deleteDoc(docRef);
  } catch (error) {
    console.log('[DAO] Fail to delete doc', error);
  }
}
