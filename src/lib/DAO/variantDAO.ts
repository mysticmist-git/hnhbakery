import { db } from '@/firebase/config';
import Variant, { variantConverter } from '@/models/variant';
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
import { getProductSnapshots } from './productDAO';

export async function getVariants() {
  try {
    const productSnapshots = await getProductSnapshots();

    if (!productSnapshots) {
      return [];
    }

    let data: Variant[] = [];

    for (const p of productSnapshots) {
      const variantsRef = collection(
        p.ref,
        COLLECTION_NAME.VARIANTS
      ).withConverter(variantConverter);
      data.push(...(await getDocs(variantsRef)).docs.map((doc) => doc.data()));
    }

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

export async function getVariantSnapshots() {
  try {
    const productSnapshots = await getProductSnapshots();

    if (!productSnapshots) {
      return [];
    }

    let data: QueryDocumentSnapshot<Variant>[] = [];

    for (const p of productSnapshots) {
      const variantsRef = collection(
        p.ref,
        COLLECTION_NAME.VARIANTS
      ).withConverter(variantConverter);
      data.push(...(await getDocs(variantsRef)).docs);
    }

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

export async function getVariantsByProduct(
  productTypeId: string,
  productId: string
) {
  try {
    const collectionRef = collection(
      db,
      COLLECTION_NAME.PRODUCT_TYPES,
      productTypeId,
      COLLECTION_NAME.PRODUCTS,
      productId,
      COLLECTION_NAME.VARIANTS
    );

    const snapshot = await getDocs(collectionRef);

    const data = snapshot.docs.map((doc) => doc.data());

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get doc', error);
  }
}

export async function updateVariant(id: string, data: Variant) {
  try {
    const docRef = doc(db, COLLECTION_NAME.VARIANTS, id).withConverter(
      variantConverter
    );

    await updateDoc(docRef, data);
  } catch (error) {
    console.log('[DAO] Fail to update doc', error);
  }
}

export async function createVariant(data: Variant) {
  try {
    await addDoc(collection(db, COLLECTION_NAME.VARIANTS), data);
  } catch (error) {
    console.log('[DAO] Fail to create doc', error);
  }
}

export async function deleteVariant(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.VARIANTS, id).withConverter(
      variantConverter
    );

    await deleteDoc(docRef);
  } catch (error) {
    console.log('[DAO] Fail to delete doc', error);
  }
}
