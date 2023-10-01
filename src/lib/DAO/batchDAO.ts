import { db } from '@/firebase/config';
import Batch, { batchConverter } from '@/models/batch';
import Variant from '@/models/variant';
import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
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
  getAllVariantSnapshots,
  getAllVariants,
  getVariantRef,
} from './variantDAO';

export function getBatchesRef(
  variantRef: DocumentReference<Variant>
): CollectionReference<Batch>;

export function getBatchesRef(
  productTypeId: string,
  productId: string,
  variantId: string
): CollectionReference<Batch>;

export function getBatchesRef(
  arg: DocumentReference<Variant> | string,
  productId?: string,
  variantId?: string
): CollectionReference<Batch> {
  if (typeof arg === 'string') {
    return collection(
      getVariantRef(arg, productId!, variantId!),
      COLLECTION_NAME.BATCHES
    ).withConverter(batchConverter);
  } else {
    return collection(arg, COLLECTION_NAME.BATCHES).withConverter(
      batchConverter
    );
  }
}

export function getBatchRef(
  productTypeId: string,
  productId: string,
  variantId: string,
  id: string
): DocumentReference<Batch>;

export function getBatchRef(
  variantRef: DocumentReference<Variant>,
  id: string
): DocumentReference<Batch>;

export function getBatchRef(
  arg1: DocumentReference<Variant> | string,
  arg2: string,
  arg3?: string,
  id?: string
): DocumentReference<Batch> {
  if (typeof arg1 === 'string') {
    return doc(getBatchesRef(arg1, arg2, arg3!), id!).withConverter(
      batchConverter
    );
  } else {
    return doc(getBatchesRef(arg1), arg2).withConverter(batchConverter);
  }
}

export async function getBatchesSnapshot(
  productTypeId: string,
  productId: string,
  variantId: string
): Promise<QuerySnapshot<Batch>>;

export async function getBatchesSnapshot(
  variantRef: DocumentReference<Variant>
): Promise<QuerySnapshot<Batch>>;

export async function getBatchesSnapshot(
  arg1: DocumentReference<Variant> | string,
  arg2?: string,
  arg3?: string
): Promise<QuerySnapshot<Batch>> {
  if (typeof arg1 === 'string') {
    return await getDocs(getBatchesRef(arg1, arg2!, arg3!));
  } else {
    return await getDocs(getBatchesRef(arg1));
  }
}

export async function getBatchSnapshot(
  productTypeId: string,
  productId: string,
  variantId: string,
  id: string
): Promise<DocumentSnapshot<Batch>>;

export async function getBatchSnapshot(
  variantRef: DocumentReference<Variant>,
  id: string
): Promise<DocumentSnapshot<Batch>>;

export async function getBatchSnapshot(
  arg1: DocumentReference<Variant> | string,
  arg2: string,
  arg3?: string,
  id?: string
): Promise<DocumentSnapshot<Batch>> {
  if (typeof arg1 === 'string') {
    return await getDoc(getBatchRef(arg1, arg2, arg3!, id!));
  } else {
    return await getDoc(getBatchRef(arg1, arg2));
  }
}

export async function getBatches(
  productTypeId: string,
  productId: string,
  variantId: string
): Promise<Batch[]>;

export async function getBatches(
  variantRef: DocumentReference<Variant>
): Promise<Batch[]>;

export async function getBatches(
  arg1: DocumentReference<Variant> | string,
  arg2?: string,
  arg3?: string
): Promise<Batch[]> {
  if (typeof arg1 === 'string') {
    return (await getBatchesSnapshot(arg1, arg2!, arg3!)).docs.map((doc) =>
      doc.data()
    );
  } else {
    return (await getBatchesSnapshot(arg1)).docs.map((doc) => doc.data());
  }
}

export async function getAllBatches() {
  const allVariants = await getAllVariantSnapshots();

  const allBatches: Batch[] = [];

  for (const variant of allVariants) {
    const batches = await getBatches(variant.ref);

    allBatches.push(...batches);
  }

  return allBatches;
}

export async function getBatch(
  productTypeId: string,
  productId: string,
  variantId: string,
  id: string
): Promise<Batch | undefined>;

export async function getBatch(
  variantRef: DocumentReference<Variant>,
  id: string
): Promise<Batch | undefined>;

export async function getBatch(
  arg1: DocumentReference<Variant> | string,
  arg2: string,
  arg3?: string,
  id?: string
): Promise<Batch | undefined> {
  if (typeof arg1 === 'string') {
    return (await getBatchSnapshot(arg1, arg2, arg3!, id!)).data();
  } else {
    return (await getBatchSnapshot(arg1, arg2)).data();
  }
}

export async function updateBatch(
  productTypeId: string,
  productId: string,
  variantId: string,
  id: string,
  data: Batch
): Promise<void>;

export async function updateBatch(
  variantRef: DocumentReference<Variant>,
  id: string,
  data: Batch
): Promise<void>;

export async function updateBatch(
  batchRef: DocumentReference<Batch>,
  data: Batch
): Promise<void>;

export async function updateBatch(
  arg1: DocumentReference<Variant> | DocumentReference<Batch> | string,
  arg2: string | Batch,
  arg3?: string | Batch,
  arg4?: string,
  data?: Batch
): Promise<void> {
  if (typeof arg1 === 'string') {
    const batchRef = getBatchRef(arg1, arg2 as string, arg3! as string, arg4!);
    await updateDoc(batchRef, data!);
  } else if (arg1 instanceof DocumentReference && typeof arg2 === 'string') {
    const batchRef = getBatchRef(arg1 as DocumentReference<Variant>, arg2);
    await updateDoc(batchRef, data!);
  } else {
    await updateDoc(arg1 as DocumentReference<Batch>, data!);
  }
}

export async function deleteBatch(
  productTypeId: string,
  productId: string,
  variantId: string,
  id: string
): Promise<void>;

export async function deleteBatch(
  variantRef: DocumentReference<Variant>,
  id: string
): Promise<void>;

export async function deleteBatch(
  batchRef: DocumentReference<Batch>
): Promise<void>;

export async function deleteBatch(
  arg1: DocumentReference<Variant> | DocumentReference<Batch> | string,
  arg2?: string,
  arg3?: string,
  arg4?: string
): Promise<void> {
  if (typeof arg1 === 'string') {
    const batchRef = getBatchRef(arg1, arg2 as string, arg3! as string, arg4!);
    await deleteDoc(batchRef);
  } else if (arg1 instanceof DocumentReference && typeof arg2 === 'string') {
    const batchRef = getBatchRef(arg1 as DocumentReference<Variant>, arg2);
    await deleteDoc(batchRef);
  } else {
    await deleteDoc(arg1 as DocumentReference<Batch>);
  }
}
