import { storage, db } from '@/firebase/config';
import {
  DocumentData,
  QuerySnapshot,
  Timestamp,
  addDoc,
  collection,
  doc,
  documentId,
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
import { CollectionName } from '../models/utilities';
import { ProductObject, ProductTypeObject } from '../models';

//#region Document Related Functions

export const addDocumentToFirestore = async (
  data: DocumentData,
  collectionName: CollectionName,
): Promise<string> => {
  try {
    delete data.id;

    const docRef = await addDoc(collection(db, collectionName), data);
    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  } catch (e) {
    console.log('Error adding new document to firestore: ', e);
    return '';
  }
};

export async function updateDocumentToFirestore(
  displayingData: DocumentData,
  collectionName: CollectionName,
) {
  // Null check
  if (!displayingData) return;

  const id = displayingData.id;

  try {
    await updateDoc(doc(db, collectionName, id), displayingData);
  } catch (error) {
    console.log('Error: ', error);
  }
}

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
    console.log('Image upload fail, error: ', error);
    return '';
  }
};

export const deleteImageFromFirebaseStorage = async (imagePath: string) => {
  const storageRef = ref(storage, `images/${imagePath}`);

  try {
    await deleteObject(storageRef);
  } catch (error) {
    console.log('Error deleting storage object: ', error);
    return '';
  }
};

export const getDownloadUrlsFromFirebaseStorage = memoize(
  async (paths: string[]) => {
    console.log(paths);

    if (!paths) {
      return null;
    }

    if (paths.length === 0) {
      return [];
    }

    try {
      const promises = paths.map((path) => getDownloadURL(ref(storage, path)));
      const urls = await Promise.all(promises);
      return urls;
    } catch (error) {
      console.log('Error: ', error);
      return null;
    }
  },
);
export const getDownloadUrlFromFirebaseStorage = memoize(
  async (path: string) => {
    console.log(path);

    if (!path) {
      return null;
    }

    try {
      const url = await getDownloadURL(ref(storage, path));
      console.log(url);
      return url;
    } catch (error) {
      console.log('Error: ', error);
      return null;
    }
  },
);

//#endregion

//#region Get Collection Functions

//#region Specific Functions (You can just delete this, i keep it just in case)

export async function getProductTypes(): Promise<ProductTypeObject[]> {
  const productTypeCollectionRef = collection(db, 'productTypes');

  const querySnapshot = await getDocs(productTypeCollectionRef);

  const productTypes: ProductTypeObject[] = querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as ProductTypeObject),
  );

  return productTypes ?? [];
}

//#endregion

export async function getCollection<T>(collectionName: string): Promise<T[]> {
  if (!collectionName) return [];

  const collectionRef = collection(db, collectionName);

  const querySnapshot = await getDocs(collectionRef);

  const docs: T[] = querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as T),
  );

  return docs ?? [];
}

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
        data[key] = data[key].toDate().toISOString();
      }
    });
    return { id: doc.id, ...data };
  });
}

export async function getBestSellterProducts(): Promise<ProductObject[]> {
  // Constants
  const minSoldQuantity = 5;
  const queryLimit = 6;

  // Create a reference to the batches collection
  const batchesRef = collection(db, 'batches');

  const batchQuery = query(
    batchesRef,
    where('soldQuantity', '>=', minSoldQuantity),
    orderBy('soldQuantity', 'desc'),
    limit(queryLimit),
  );

  // Retrieve the results and use the productType_id to query the productTypes collection
  const querySnapshot = await getDocs(batchQuery);

  const productIds = querySnapshot.docs.map((doc) => doc.data().product_id);

  console.log(productIds);

  // Check if there are any products
  if (productIds.length === 0) return [];

  const productsRef = collection(db, 'products');
  const productQuery = query(
    productsRef,
    where(documentId(), 'in', productIds),
  );
  const productsSnapshot = await getDocs(productQuery);
  const products = productsSnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as ProductObject),
  );
  // Do something with the productTypes

  console.log(products);

  return products ?? [];
}

//#endregion
