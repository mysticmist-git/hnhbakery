import { db } from '@/firebase/config';
import ProductType, { productTypeConverter } from '@/models/productType';
import {
  DocumentData,
  DocumentReference,
  QueryConstraint,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';

export function getProductTypesRef() {
  return collection(db, COLLECTION_NAME.PRODUCT_TYPES).withConverter(
    productTypeConverter
  );
}

export function getProductTypesRefWithQuery(
  ...queryConstraints: QueryConstraint[]
) {
  return query(getProductTypesRef(), ...queryConstraints).withConverter(
    productTypeConverter
  );
}

export function getProductTypeRefById(id: string) {
  return doc(getProductTypesRef(), id).withConverter(productTypeConverter);
}

export async function getProductTypesSnapshot() {
  return await getDocs(getProductTypesRef());
}

export async function getProductTypes() {
  return (await getProductTypesSnapshot()).docs.map((doc) => doc.data());
}

export async function getProductTypesSnapshotWithQuery(
  ...queryConstraints: QueryConstraint[]
) {
  return await getDocs(getProductTypesRefWithQuery(...queryConstraints));
}

export async function getProductTypesWithQuery(
  ...queryConstraints: QueryConstraint[]
) {
  return (await getProductTypesSnapshotWithQuery(...queryConstraints)).docs.map(
    (doc) => doc.data()
  );
}

export async function getProductTypeSnapshotById(id: string) {
  return await getDoc(getProductTypeRefById(id));
}

export async function getProductTypeById(id: string) {
  return (await getProductTypeSnapshotById(id)).data();
}

export async function updateProductType(id: string, data: ProductType) {
  await updateDoc(getProductTypeRefById(id), data);
}

export async function createProductType(
  ref: DocumentReference<ProductType>,
  data: Omit<ProductType, 'id'>
): Promise<DocumentReference<ProductType>>;
export async function createProductType(
  data: Omit<ProductType, 'id'>
): Promise<DocumentReference<ProductType>>;
export async function createProductType(
  arg1: DocumentReference<ProductType> | Omit<ProductType, 'id'>,
  arg2?: Omit<ProductType, 'id'>
): Promise<DocumentReference<Omit<ProductType, 'id'>> | undefined> {
  if (arg1 instanceof DocumentReference) {
    const ref = arg1;
    const data = arg2 as Omit<ProductType, 'id'>;

    await setDoc(ref, data);
  } else {
    const data = arg1;

    return addDoc(getProductTypesRef(), data);
  }
}

export async function deleteProductType(id: string) {
  await deleteDoc(getProductTypeRefById(id));
}
