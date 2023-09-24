import { db } from '@/firebase/config';
import Size, { sizeConverter } from '@/models/size';
import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  Query,
  QueryConstraint,
  QuerySnapshot,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';

export function getSizesRef(): CollectionReference<Size> {
  return collection(db, COLLECTION_NAME.SIZES).withConverter(sizeConverter);
}

export function getSizesQuery(
  ...queryConstraints: QueryConstraint[]
): Query<Size> {
  return query(getSizesRef(), ...queryConstraints);
}

export function getSizeRef(id: string): DocumentReference<Size> {
  return doc(getSizesRef(), id);
}

export async function getSizesSnapshot(): Promise<QuerySnapshot<Size>> {
  return await getDocs(getSizesRef());
}

export async function getSizes(): Promise<Size[]> {
  return (await getSizesSnapshot()).docs.map((doc) => doc.data());
}

export async function getSizesSnapshotWithQuery(
  ...queryConstraints: QueryConstraint[]
): Promise<QuerySnapshot<Size>> {
  return await getDocs(getSizesQuery(...queryConstraints));
}

export async function getSizesWithQuery(
  ...queryConstraints: QueryConstraint[]
): Promise<Size[]> {
  return (await getDocs(getSizesQuery(...queryConstraints))).docs.map((doc) =>
    doc.data()
  );
}

export async function getSizeSnapshot(
  id: string
): Promise<DocumentSnapshot<Size>> {
  return await getDoc(getSizeRef(id));
}

export async function getSize(id: string): Promise<Size | undefined> {
  return (await getSizeSnapshot(id)).data();
}

export async function createSize(data: Omit<Size, 'id'>) {
  return (await addDoc(getSizesRef(), data)).withConverter(sizeConverter);
}

export async function updateSize(id: string, data: Size): Promise<void>;
export async function updateSize(
  docRef: DocumentReference<Size>,
  data: Size
): Promise<void>;
export async function updateSize(
  arg: string | DocumentReference<Size>,
  data: Size
): Promise<void> {
  if (typeof arg === 'string') {
    return await updateDoc(getSizeRef(arg), data);
  } else {
    return await updateDoc(arg, data);
  }
}

export async function deleteDoc(id: string): Promise<void>;
export async function deleteDoc(docRef: DocumentReference<Size>): Promise<void>;
export async function deleteDoc(
  arg: string | DocumentReference<Size>
): Promise<void> {
  if (typeof arg === 'string') {
    await deleteDoc(getSizeRef(arg));
  } else {
    await deleteDoc(arg);
  }
}
