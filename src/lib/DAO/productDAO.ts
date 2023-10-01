import Product, { productConverter } from '@/models/product';
import {
  DocumentSnapshot,
  QueryConstraint,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';
import {
  getProductTypes,
  getProductTypesRef,
  getProductTypesSnapshot,
} from './productTypeDAO';

export function getProductsRef(productTypeId: string) {
  return collection(
    getProductTypesRef(),
    productTypeId,
    COLLECTION_NAME.PRODUCTS
  ).withConverter(productConverter);
}

export function getProductsRefWithQuery(
  productTypeId: string,
  ...queryConstraints: QueryConstraint[]
) {
  return query(
    getProductsRef(productTypeId),
    ...queryConstraints
  ).withConverter(productConverter);
}

export function getProductRef(productTypeId: string, id: string) {
  return doc(getProductsRef(productTypeId), id).withConverter(productConverter);
}

export async function getProductsSnapshot(productTypeId: string) {
  return await getDocs(getProductsRef(productTypeId));
}

export async function getProducts(productTypeId: string) {
  return (await getProductsSnapshot(productTypeId)).docs.map((doc) =>
    doc.data()
  );
}

export async function getAllProductSnapshots(): Promise<
  DocumentSnapshot<Product>[]
> {
  const productTypesQuerySnapshots = (await getProductTypesSnapshot()).docs;

  const productSnapshots: DocumentSnapshot<Product>[] = [];

  for (const productTypeQuerySnapshot of productTypesQuerySnapshots) {
    productSnapshots.push(
      ...(await getProductsSnapshot(productTypeQuerySnapshot.id)).docs
    );
  }

  return productSnapshots;
}

export async function getAllProducts() {
  const productTypes = await getProductTypes();

  const allProducts: Product[] = [];

  for (const type of productTypes) {
    allProducts.push(...(await getProducts(type.id)));
  }

  return allProducts;
}

export async function getProductsSnapshotWithQuery(
  productTypeId: string,
  ...queryConstraints: QueryConstraint[]
) {
  return await getDocs(
    getProductsRefWithQuery(productTypeId, ...queryConstraints)
  );
}

export async function getProductsWithQuery(
  productTypeId: string,
  ...queryConstraints: QueryConstraint[]
) {
  return (
    await getProductsSnapshotWithQuery(productTypeId, ...queryConstraints)
  ).docs.map((doc) => doc.data());
}

export async function getProductSnapshot(productTypeId: string, id: string) {
  return await getDoc(getProductRef(productTypeId, id));
}

export async function getProduct(productTypeId: string, id: string) {
  return (await getProductSnapshot(productTypeId, id)).data();
}

export async function updateProduct(
  productTypeId: string,
  id: string,
  data: Product
) {
  return await updateDoc(getProductRef(productTypeId, id), data);
}

export async function createProduct(
  productTypeId: string,
  data: Omit<Product, 'id'>
) {
  return await addDoc(getProductsRef(productTypeId), data);
}

export async function deleteProduct(productTypeId: string, id: string) {
  return await deleteDoc(getProductRef(productTypeId, id));
}
