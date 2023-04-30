import { DocumentData, QuerySnapshot, Timestamp } from 'firebase/firestore';

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
