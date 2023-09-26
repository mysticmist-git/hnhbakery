import Product from '@/models/product';
import Variant, { variantConverter } from '@/models/variant';
import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { productionBrowserSourceMaps } from '../../../next.config';
import { COLLECTION_NAME } from '../constants';
import { getProductRef } from './productDAO';

export function getVariantsRef(
  productRef: DocumentReference<Product>
): CollectionReference<Variant>;
export function getVariantsRef(
  productTypeId: string,
  productId: string
): CollectionReference<Variant>;
export function getVariantsRef(
  arg: DocumentReference<Product> | string,
  productId?: string
): CollectionReference<Variant> {
  if (typeof arg === 'string') {
    return collection(
      getProductRef(arg, productId!),
      COLLECTION_NAME.VARIANTS
    ).withConverter(variantConverter);
  } else {
    return collection(arg, COLLECTION_NAME.VARIANTS).withConverter(
      variantConverter
    );
  }
}

export function getVariantRef(
  productTypeId: string,
  productId: string,
  id: string
): DocumentReference<Variant>;
export function getVariantRef(
  productRef: DocumentReference<Product>,
  id: string
): DocumentReference<Variant>;
export function getVariantRef(
  arg1: DocumentReference<Product> | string,
  arg2: string,
  id?: string
): DocumentReference<Variant> {
  if (typeof arg1 === 'string') {
    return doc(getVariantsRef(arg1, arg2), id!).withConverter(variantConverter);
  } else {
    return doc(getVariantsRef(arg1), arg2).withConverter(variantConverter);
  }
}

export async function getVariantsSnapshot(
  productTypeId: string,
  productId: string
): Promise<QuerySnapshot<Variant>>;
export async function getVariantsSnapshot(
  productRef: DocumentReference<Product>
): Promise<QuerySnapshot<Variant>>;
export async function getVariantsSnapshot(
  arg1: string | DocumentReference<Product>,
  arg2?: string
): Promise<QuerySnapshot<Variant>> {
  if (typeof arg1 === 'string') {
    return await getDocs(getVariantsRef(arg1, arg2!));
  } else {
    return await getDocs(getVariantsRef(arg1));
  }
}

export async function getVariantSnapshot(
  productTypeId: string,
  productId: string,
  id: string
): Promise<DocumentSnapshot<Variant>>;
export async function getVariantSnapshot(
  productRef: DocumentReference<Product>,
  id: string
): Promise<DocumentSnapshot<Variant>>;
export async function getVariantSnapshot(
  arg1: string | DocumentReference<Product>,
  arg2: string,
  id?: string
): Promise<DocumentSnapshot<Variant>> {
  if (typeof arg1 === 'string') {
    return await getDoc(getVariantRef(arg1, arg2, id!));
  } else {
    return await getDoc(getVariantRef(arg1, arg2));
  }
}

export async function getVariants(
  productTypeId: string,
  productId: string
): Promise<Variant[]>;
export async function getVariants(
  productRef: DocumentReference<Product>
): Promise<Variant[]>;
export async function getVariants(
  arg1: string | DocumentReference<Product>,
  productId?: string
): Promise<Variant[]> {
  if (typeof arg1 === 'string') {
    return (await getVariantsSnapshot(arg1, productId!)).docs.map((doc) =>
      doc.data()
    );
  } else {
    return (await getVariantsSnapshot(arg1)).docs.map((doc) => doc.data());
  }
}

export async function getVariant(
  productTypeId: string,
  productId: string,
  id: string
): Promise<Variant | undefined>;
export async function getVariant(
  productRef: DocumentReference<Product>,
  id: string
): Promise<Variant | undefined>;
export async function getVariant(
  arg1: string | DocumentReference<Product>,
  arg2: string,
  id?: string
): Promise<Variant | undefined> {
  if (typeof arg1 === 'string') {
    return (await getVariantSnapshot(arg1, arg2, id!)).data();
  } else {
    return (await getVariantSnapshot(arg1, id!)).data();
  }
}

export async function updateVariant(
  productTypeId: string,
  productId: string,
  id: string,
  data: Variant
): Promise<void>;
export async function updateVariant(
  productRef: DocumentReference<Product>,
  id: string,
  data: Variant
): Promise<void>;
export async function updateVariant(
  variantRef: DocumentReference<Variant>,
  data: Variant
): Promise<void>;
export async function updateVariant(
  arg1: string | DocumentReference<Product> | DocumentReference<Variant>,
  arg2: string | Variant,
  arg3?: string | Variant,
  data?: Variant
): Promise<void> {
  if (typeof arg1 === 'string') {
    const productTypeId = arg1 as string;
    const productId = arg2 as string;
    const id = arg3 as string;

    await updateDoc(getVariantRef(productTypeId, productId, id), data);
  } else if (arg1 instanceof DocumentReference && typeof arg2 === 'string') {
    const productRef = arg1 as DocumentReference<Product>;
    const id = arg2 as string;

    await updateDoc(getVariantRef(productRef, id), data);
  } else {
    const variantRef = arg1 as DocumentReference<Variant>;

    await updateDoc(variantRef, data);
  }
}

export async function deleteVariant(
  productTypeId: string,
  productId: string,
  id: string
): Promise<void>;
export async function deleteVariant(
  productRef: DocumentReference<Product>,
  id: string
): Promise<void>;
export async function deleteVariant(
  variantRef: DocumentReference<Variant>
): Promise<void>;
export async function deleteVariant(
  arg1: string | DocumentReference<Product> | DocumentReference<Variant>,
  arg2?: string,
  arg3?: string
): Promise<void> {
  if (typeof arg1 === 'string') {
    const productTypeId = arg1 as string;
    const productId = arg2 as string;
    const id = arg3 as string;

    await deleteDoc(getVariantRef(productTypeId, productId, id));
  } else if (arg1 instanceof DocumentReference && typeof arg2 === 'string') {
    const productRef = arg1 as DocumentReference<Product>;
    const id = arg2 as string;

    await deleteDoc(getVariantRef(productRef, id));
  } else {
    const variantRef = arg1 as DocumentReference<Variant>;

    await deleteDoc(variantRef);
  }
}
