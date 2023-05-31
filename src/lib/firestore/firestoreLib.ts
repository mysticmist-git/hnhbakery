import { storage, db } from '@/firebase/config';
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  QueryConstraint,
  QuerySnapshot,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from 'firebase/storage';
import { memoize } from '../localLib/manage-modal';
import { ProductObject } from '../models';
import { filterDuplicates } from '../utilities';

//#region Document Related Functions

export const getDocFromFirestore = async (
  collectionName: string,
  documentId: string,
): Promise<DocumentData> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    const docData = getDocFromQuerySnapshot(docSnap);

    if (!docData) throw new Error('Doc data is null');

    return docData;
  } catch (error: any) {
    throw new Error(`Lỗi: ${error.message}`);
  }
};

export const addDocToFirestore = async (
  data: DocumentData,
  collectionName: string,
): Promise<DocumentReference<DocumentData>> => {
  try {
    delete data.id;
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef;
  } catch (e) {
    throw new Error(`Error: ${e}`);
  }
};

export const addDocsToFirestore = async (
  data: DocumentData[],
  collectionName: string,
): Promise<DocumentReference<DocumentData>[]> => {
  try {
    const docRefs = [];

    for (let i = 0; i < data.length; i++) {
      const docRef = await addDoc(collection(db, collectionName), data[i]);

      docRefs.push(docRef);
    }

    return docRefs;
  } catch (e) {
    throw new Error(`Error: ${e}`);
  }
};

export async function updateDocToFirestore(
  data: DocumentData,
  collectionName: string,
) {
  // Null check
  if (!data) throw Error('Data is null');
  const id = data.id;

  try {
    await updateDoc(doc(db, collectionName, id), data);
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

export const deleteDocFromFirestore = async (
  collectionName: string,
  documentId: string,
) => {
  try {
    await deleteDoc(doc(db, collectionName, documentId));
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
};

//#endregion

//#region Images Releated Functions

/**
 * Uploads an image file to Firebase storage.
 *
 * @param {any} imageFile - The image file to upload.
 * @return {Promise<string>} - A promise that resolves with the full path of the uploaded image file in Firebase storage.
 *    If the upload fails, the promise resolves with an empty string.
 */

export const uploadImageToFirebaseStorage = async (
  imageFile: any,
): Promise<string> => {
  const storageRef = ref(storage, `images/${imageFile.name}`);
  const file = imageFile;

  try {
    const uploadImage = await uploadBytes(storageRef, file);
    return uploadImage.metadata.fullPath;
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
};

export const deleteImageFromFirebaseStorage = async (imagePath: string) => {
  const storageRef = ref(storage, `images/${imagePath}`);

  try {
    await deleteObject(storageRef);
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
};

export const getDownloadUrlsFromFirebaseStorage = memoize(
  async (paths: string[]) => {
    if (!paths) {
      throw new Error('Paths is null');
    }

    if (paths.length === 0) {
      throw new Error('Paths is empty');
    }

    try {
      const promises = paths.map((path) => getDownloadURL(ref(storage, path)));
      const urls = await Promise.all(promises);
      return urls;
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  },
);

export const getDownloadUrlFromFirebaseStorage = memoize(
  async (path: string) => {
    if (!path) {
      throw new Error('Path is null');
    }

    try {
      const url = await getDownloadURL(ref(storage, path));
      return url;
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  },
);

//#endregion

//#region Get Collection Functions

export async function getCollection<T>(collectionName: string): Promise<T[]> {
  if (!collectionName) return [];

  const collectionRef = collection(db, collectionName);

  const querySnapshot = await getDocs(collectionRef);

  const docs = getDocsFromQuerySnapshot(querySnapshot) as T[];

  if (!docs) throw new Error('Docs are null');

  return docs;
}

export const getCollectionWithQuery = async <T>(
  collectionName: string,
  ...queryConstraints: QueryConstraint[]
): Promise<T[]> => {
  const collectionRef = collection(db, collectionName);

  const collectionQuery = query(collectionRef, ...queryConstraints);

  try {
    const querySnapshot = await getDocs(collectionQuery);
    const docs = getDocsFromQuerySnapshot(querySnapshot);

    return docs as T[];
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
};

/**
 * Returns an array of DocumentData obtained from a QuerySnapshot.
 *
 * @param {QuerySnapshot<DocumentData>} querySnapshot - The QuerySnapshot to obtain DocumentData from.
 * @return {DocumentData[]} An array of DocumentData obtained from the QuerySnapshot.
 */
export function getDocsFromQuerySnapshot(
  querySnapshot: QuerySnapshot<DocumentData>,
): DocumentData[] {
  // Null check
  if (!querySnapshot) return [];

  // Get docs
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    // Convert Date objects to ISO strings
    Object.keys(data).forEach((key) => {
      if (data[key] instanceof Timestamp) {
        data[key] = data[key].toDate();
      }
    });
    return { ...data, id: doc.id };
  });
}

export function getDocFromQuerySnapshot(
  docSnapshot: DocumentSnapshot<DocumentData>,
): DocumentData | null {
  // Null check
  if (!docSnapshot) return null;

  // Get doc
  const data = docSnapshot.data();

  if (!data) return null;

  Object.keys(data).forEach((key) => {
    if (data[key] instanceof Timestamp) {
      data[key] = data[key].toDate();
    }
  });

  return { ...data, id: docSnapshot.id };
}
export async function getBestSellterProducts(): Promise<ProductObject[]> {
  // Constants
  const minSoldQuantity = 5;
  const queryLimit = 7;

  const batches = await getCollectionWithQuery<ProductObject>(
    'batches',
    where('soldQuantity', '>=', minSoldQuantity),
    orderBy('soldQuantity', 'desc'),
    limit(queryLimit),
  );

  const filterExpireBatchs = batches.filter(
    (batch) => new Date(batch.EXP).getTime() > new Date().getTime(),
  );

  const productIds = filterDuplicates<string>(
    filterExpireBatchs.map((doc) => doc.product_id),
  );

  if (productIds.length === 0) return [];

  const products = getCollectionWithQuery<ProductObject>(
    'products',
    where(documentId(), 'in', productIds),
  );
  // Do something with the productTypes

  return products ?? [];
}

//#endregion

// #region Contact

export interface Contact {
  name: string;
  email: string;
  phone?: string;
  title: string;
  content: string;
}
export const sendContact = async (form: Contact) => {
  if (!form) return;

  try {
    const contacts = collection(db, 'contacts');
    await addDoc(contacts, form);
  } catch (error) {
    console.log(error);
  }
};

// #endregion

export const updateBillState  = async (billId: string, state: number): Promise<boolean> => {
  if (billId === '') return false;

  if (![-1, 0, 1].includes(state)) return false;

  try {
    await updateDoc(doc(db, 'bills', billId), { state });
  return true;
  } catch (error) {
    console.log(`Error update bill state `, error)
    return false;
  }
}
