import { db } from '@/firebase/config';
import Feedback, { feedbackConverter } from '@/models/feedback';
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
import Product from '@/models/product';
import { getProductRef } from './productDAO';

export function getFeedbacksRef(
  productRef: DocumentReference<Product>
): CollectionReference<Feedback>;

export function getFeedbacksRef(
  productTypeId: string,
  productId: string
): CollectionReference<Feedback>;

export function getFeedbacksRef(
  arg: DocumentReference<Product> | string,
  productId?: string
): CollectionReference<Feedback> {
  if (typeof arg === 'string') {
    return collection(
      getProductRef(arg, productId!),
      COLLECTION_NAME.FEEDBACKS
    ).withConverter(feedbackConverter);
  } else {
    return collection(arg, COLLECTION_NAME.FEEDBACKS).withConverter(
      feedbackConverter
    );
  }
}

export function getFeedbackRef(
  productTypeId: string,
  productId: string,
  id: string
): DocumentReference<Feedback>;

export function getFeedbackRef(
  productRef: DocumentReference<Product>,
  id: string
): DocumentReference<Feedback>;

export function getFeedbackRef(
  arg1: DocumentReference<Product> | string,
  arg2: string,
  id?: string
): DocumentReference<Feedback> {
  if (typeof arg1 === 'string') {
    return doc(getFeedbacksRef(arg1, arg2), id!).withConverter(
      feedbackConverter
    );
  } else {
    return doc(getFeedbacksRef(arg1), arg2).withConverter(feedbackConverter);
  }
}

export async function getFeedbacksSnapshot(
  productTypeId: string,
  productId: string
): Promise<QuerySnapshot<Feedback>>;

export async function getFeedbacksSnapshot(
  productRef: DocumentReference<Product>
): Promise<QuerySnapshot<Feedback>>;

export async function getFeedbacksSnapshot(
  arg1: DocumentReference<Product> | string,
  arg2?: string
): Promise<QuerySnapshot<Feedback>> {
  if (typeof arg1 === 'string') {
    return await getDocs(getFeedbacksRef(arg1, arg2!));
  } else {
    return await getDocs(getFeedbacksRef(arg1));
  }
}

export async function getFeedbackSnapshot(
  productTypeId: string,
  productId: string,
  id: string
): Promise<DocumentSnapshot<Feedback>>;

export async function getFeedbackSnapshot(
  productRef: DocumentReference<Product>,
  id: string
): Promise<DocumentSnapshot<Feedback>>;

export async function getFeedbackSnapshot(
  arg1: DocumentReference<Product> | string,
  arg2: string,
  id?: string
): Promise<DocumentSnapshot<Feedback>> {
  if (typeof arg1 === 'string') {
    return await getDoc(getFeedbackRef(arg1, arg2, id!));
  } else {
    return await getDoc(getFeedbackRef(arg1, arg2));
  }
}

export async function getFeedbacks(
  productTypeId: string,
  productId: string
): Promise<Feedback[]>;

export async function getFeedbacks(
  productRef: DocumentReference<Product>
): Promise<Feedback[]>;

export async function getFeedbacks(
  arg1: DocumentReference<Product> | string,
  arg2?: string
): Promise<Feedback[]> {
  if (typeof arg1 === 'string') {
    return (await getFeedbacksSnapshot(arg1, arg2!)).docs.map((doc) =>
      doc.data()
    );
  } else {
    return (await getFeedbacksSnapshot(arg1)).docs.map((doc) => doc.data());
  }
}

export async function getFeedback(
  productTypeId: string,
  productId: string,
  id: string
): Promise<Feedback | undefined>;

export async function getFeedback(
  productRef: DocumentReference<Product>,
  id: string
): Promise<Feedback | undefined>;

export async function getFeedback(
  arg1: DocumentReference<Product> | string,
  arg2: string,
  id?: string
): Promise<Feedback | undefined> {
  if (typeof arg1 === 'string') {
    return (await getFeedbackSnapshot(arg1, arg2, id!)).data();
  } else {
    return (await getFeedbackSnapshot(arg1, arg2)).data();
  }
}

export async function updateFeedback(
  productTypeId: string,
  productId: string,
  id: string,
  data: Feedback
): Promise<void>;

export async function updateFeedback(
  productRef: DocumentReference<Product>,
  id: string,
  data: Feedback
): Promise<void>;

export async function updateFeedback(
  feedbackRef: DocumentReference<Feedback>,
  data: Feedback
): Promise<void>;

export async function updateFeedback(
  arg1: string | DocumentReference<Product> | DocumentReference<Feedback>,
  arg2: string | Feedback,
  arg3?: string | Feedback,
  data?: Feedback
): Promise<void> {
  if (typeof arg1 === 'string') {
    const productTypeId = arg1 as string;
    const productId = arg2 as string;
    const id = arg3 as string;
    await updateDoc(getFeedbackRef(productTypeId, productId, id), data);
  } else if (arg1 instanceof DocumentReference && typeof arg2 === 'string') {
    const productRef = arg1 as DocumentReference<Product>;
    const id = arg2 as string;
    await updateDoc(getFeedbackRef(productRef, id), data);
  } else {
    const feedbackRef = arg1 as DocumentReference<Feedback>;
    await updateDoc(feedbackRef, data);
  }
}

export async function createFeedback(
  productTypeId: string,
  productId: string,
  data: Omit<Feedback, 'id'>
): Promise<DocumentReference<Omit<Feedback, 'id'>>> {
  return await addDoc(getFeedbacksRef(productTypeId, productId), data);
}

export async function deleteFeedback(
  productTypeId: string,
  productId: string,
  id: string
): Promise<void>;

export async function deleteFeedback(
  productRef: DocumentReference<Product>,
  id: string
): Promise<void>;

export async function deleteFeedback(
  feedbackRef: DocumentReference<Feedback>
): Promise<void>;

export async function deleteFeedback(
  arg1: string | DocumentReference<Product> | DocumentReference<Feedback>,
  arg2?: string,
  arg3?: string
): Promise<void> {
  if (typeof arg1 === 'string') {
    const productTypeId = arg1 as string;
    const productId = arg2 as string;
    const id = arg3 as string;
    await deleteDoc(getFeedbackRef(productTypeId, productId, id));
  } else if (arg1 instanceof DocumentReference && typeof arg2 === 'string') {
    const productRef = arg1 as DocumentReference<Product>;
    const id = arg2 as string;
    await deleteDoc(getFeedbackRef(productRef, id));
  } else {
    const feedbackRef = arg1 as DocumentReference<Feedback>;
    await deleteDoc(feedbackRef);
  }
}
