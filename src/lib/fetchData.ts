import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { CollectionObj, DocumentObj } from './models/utilities';

/**
 * Fetch the document from database then parse it to an object
 * @param collectionName Collection Name
 * @param id Document Id
 * @returns A document objet
 */
export async function fetchDoc(
  collectionName: string,
  id: string,
): Promise<DocumentObj | null> {
  // Check if the collection name is valid
  if (!collectionName || collectionName === '' || !id || id === '') {
    return null;
  }

  // Get the document from firestore
  const docRef = await getDoc(doc(db, collectionName, id));

  return { id: docRef.id, ...docRef.data() } as DocumentObj;
}

/**
 * Fetch collection with passed name
 * @param collectionName Collection Name
 * @returns
 */
export async function fetchCollection(
  collectionName: string,
): Promise<CollectionObj> {
  // Check if the collection name is valid
  if (!collectionName || collectionName === '') {
    return { collectionName: collectionName, docs: [] };
  }

  // Get query snapshot from firestore
  const querySnapshot = await getDocs(collection(db, collectionName));

  let docs = querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as DocumentObj),
  );

  // Create the collection
  const mainCollection: CollectionObj = {
    collectionName: collectionName,
    docs: docs,
  };

  return mainCollection;
}
