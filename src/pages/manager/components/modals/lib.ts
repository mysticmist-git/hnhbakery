import { db, storage } from '@/firebase/config';
import { CollectionName } from '@/lib/models/utilities';
import { DocumentData, addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export type ModalMode = 'create' | 'update' | 'view' | 'none';

// Get image if there's any
export const memoize = (fn: any) => {
  const cache = new Map();
  return async (...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = await fn(...args);
    cache.set(key, result);
    return result;
  };
};

export const getDownloadUrlsFromFirebaseStorage = memoize(
  async (paths: string[]) => {
    const promises = paths.map((path) => getDownloadURL(ref(storage, path)));
    const urls = await Promise.all(promises);
    return urls;
  },
);

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
