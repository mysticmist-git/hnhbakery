import { db, storage } from '@/firebase/config';
import { COLLECTION_NAME } from '@/lib/constants';
import { FirebaseError } from 'firebase/app';
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
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { memoize } from '../localLib/manage-modal';
import { ProductObject, ProductTypeObject } from '../models';
import BaseObject from '../models/BaseObject';
import { BatchObject } from '../models/Batch';
import { ProductVariant } from '../models/Product';
import { ProductTypeWithCount } from '../models/ProductType';
import { filterDuplicates } from '../utilities/utilities';

//#region Document Related Functions

/**
 * Gets a document from Firestore.
 * @param {string} collectionName - The name of the collection to get the document from.
 * @param {string} documentId - The id of the document to get.
 * @return {Promise<BaseObject>} - A promise that resolves with the document data.
 *    If the document does not exist, the promise resolves with null.
 *    If the document does exist, the promise resolves with the document data.
 */
export const getDocFromFirestore = async <T extends BaseObject>(
  collectionName: string,
  documentId: string
): Promise<T> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    const docData = getDocFromDocumentSnapshot<T>(docSnap);

    if (!docData) throw new FirebaseError('null-doc', 'Document not found');

    return docData;
  } catch (error: any) {
    throw error;
  }
};

export const addDocToFirestore = async (
  data: BaseObject,
  collectionName: string
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
  data: BaseObject[],
  collectionName: string
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
  data: BaseObject,
  collectionName: string
) {
  // Null check
  if (!data) throw Error('Data is null');

  const id = data.id;

  if (!id) throw new Error('ID is null');

  const convertedData = { ...data } as DocumentData;
  delete convertedData.id;

  await updateDoc(doc(db, collectionName, id), convertedData);
}

export const deleteDocFromFirestore = async (
  collectionName: string,
  documentId: string
) => {
  try {
    await deleteDoc(doc(db, collectionName, documentId));
  } catch (error) {
    throw error;
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
  imageFile: File
): Promise<string> => {
  const storageRef = ref(storage, `images/${imageFile.name}`);

  let path = '';

  try {
    const result = await uploadBytes(storageRef, imageFile);
    path = result.metadata.fullPath;
  } catch (error) {
    console.log(error);
  } finally {
    return path;
  }
};

export const uploadImagesToFirebaseStorage = async (
  imageFiles: File[]
): Promise<string[]> => {
  const paths = Promise.all(
    imageFiles.map(async (file) => {
      const storageRef = ref(storage, `images/${file.name}`);

      let path = '';

      try {
        const uploadImage = await uploadBytes(storageRef, file);
        path = uploadImage.metadata.fullPath;
      } catch (error) {
        console.log(error);
      } finally {
        return path;
      }
    })
  );

  return paths;
};

export const deleteImageFromFirebaseStorage = async (imagePath: string) => {
  const storageRef = ref(storage, imagePath);

  await deleteObject(storageRef);
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
  }
);

export const getDownloadUrlFromFirebaseStorage = memoize(
  async (path: string) => {
    if (!path) {
      throw new Error('Path is null');
    }

    const url = await getDownloadURL(ref(storage, path));
    return url;
  }
);

//#endregion

//#region Get Collection Functions

export async function getCollection<T extends BaseObject>(
  collectionName: string
): Promise<T[]> {
  if (!collectionName) return [];

  const collectionRef = collection(db, collectionName);

  const querySnapshot = await getDocs(collectionRef);

  const docs = getDocsFromQuerySnapshot<T>(querySnapshot);

  if (!docs) throw new Error('Docs are null');

  return docs;
}

export const getCollectionWithQuery = async <T extends BaseObject>(
  collectionName: string,
  ...queryConstraints: QueryConstraint[]
): Promise<T[]> => {
  const collectionRef = collection(db, collectionName);

  const collectionQuery = query(collectionRef, ...queryConstraints);

  try {
    const querySnapshot = await getDocs(collectionQuery);
    const docs = getDocsFromQuerySnapshot<T>(querySnapshot);

    return docs;
  } catch (error) {
    throw error;
  }
};

/**
 * Returns an array of DocumentData obtained from a QuerySnapshot.
 *
 * @param {QuerySnapshot<DocumentData>} querySnapshot - The QuerySnapshot to obtain DocumentData from.
 * @return {DocumentData[]} An array of DocumentData obtained from the QuerySnapshot.
 */
export function getDocsFromQuerySnapshot<T extends BaseObject>(
  querySnapshot: QuerySnapshot<DocumentData>
): T[] {
  // Null check
  if (!querySnapshot) throw new Error('QuerySnapshot is null');

  // Get docs
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    // Convert Date objects to ISO strings
    Object.keys(data).forEach((key) => {
      if (data[key] instanceof Timestamp) {
        data[key] = data[key].toDate();
      }
    });
    return { ...data, id: doc.id } as T;
  });
}

export async function getDocFromDocRef<T extends BaseObject>(
  docRef: DocumentReference<DocumentData>
): Promise<T> {
  // Null check
  if (!docRef) throw new Error('Doc Ref is null');

  // Get doc
  const documentSnapshot = await getDoc(docRef);

  const data = getDocFromDocumentSnapshot<T>(documentSnapshot);

  return data;
}

export function getDocFromDocumentSnapshot<T extends BaseObject>(
  docSnapshot: DocumentSnapshot<DocumentData>
): T {
  // Null check
  if (!docSnapshot) throw new Error('DocSnapshot is null');

  // Get doc
  const data = docSnapshot.data();

  if (!data) throw new Error('Data is null');

  Object.keys(data).forEach((key) => {
    if (data[key] instanceof Timestamp) {
      data[key] = data[key].toDate();
    }
  });

  return { ...data, id: docSnapshot.id } as T;
}

export async function getBestSellterProducts(): Promise<ProductObject[]> {
  // Constants
  const minSoldQuantity = 5;
  const queryLimit = 7;

  const batches = await getCollectionWithQuery<BatchObject>(
    'batches',
    where('soldQuantity', '>=', minSoldQuantity),
    orderBy('soldQuantity', 'desc'),
    limit(queryLimit)
  );

  const filterExpireBatchs = batches.filter(
    (batch) => new Date(batch.EXP).getTime() > new Date().getTime()
  );

  const productIds = filterDuplicates<string>(
    filterExpireBatchs.map((doc) => doc.product_id)
  );

  if (productIds.length === 0) return [];

  const products = getCollectionWithQuery<ProductObject>(
    'products',
    where(documentId(), 'in', productIds)
  );

  if (!products) return [];

  return products;
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

//#region Bills

export const updateBillState = async (
  billId: string,
  state: number
): Promise<boolean> => {
  if (billId === '') return false;

  if (![-1, 0, 1].includes(state)) return false;

  try {
    await updateDoc(doc(db, 'bills', billId), { state });
    return true;
  } catch (error) {
    console.log(`Error update bill state `, error);
    return false;
  }
};

//#endregion

//#region Count

export const countDocs = async (
  collectionName: string,
  ...queryConstraints: QueryConstraint[]
): Promise<number> => {
  if (!collectionName) throw new Error('Collection name is null');

  const snapshot = await getCountFromServer(
    query(collection(db, collectionName), ...queryConstraints)
  );

  const count = snapshot.data().count;

  return count;
};

//#endregion

//#region Storage Page

export interface StorageProductTypeObject extends ProductTypeObject {
  productCount: number;
  imageURL: string;
}

export const fetchProductTypesForStoragePage = async (): Promise<
  StorageProductTypeObject[]
> => {
  const productTypes = await getCollection<ProductTypeObject>('productTypes');

  const storageProductTypes = await Promise.all(
    productTypes.map(async (type) => {
      let productCount = 0;
      let imageURL = '';

      try {
        productCount = await countDocs(
          'products',
          where('productType_id', '==', type.id)
        );

        if (type.image)
          imageURL = await getDownloadUrlFromFirebaseStorage(type.image);
      } catch (error) {
        console.log(error);
      } finally {
        return {
          ...type,
          productCount,
          imageURL,
        } as StorageProductTypeObject;
      }
    })
  );

  return storageProductTypes;
};

export type PathWithUrl = {
  path?: string;
  url: string;
};
export interface StorageProductObject extends ProductObject {
  productTypeName: string;
  imageUrls: PathWithUrl[];
}

export const fetchProductsForStoragePage = async (): Promise<
  StorageProductObject[]
> => {
  const products = await getCollection<ProductObject>(COLLECTION_NAME.PRODUCTS);

  const storageProducts = await Promise.all(
    products.map(async (product) => {
      let productType: ProductTypeObject | null = null;
      let imageUrls: PathWithUrl[] = [];

      try {
        productType = await getDocFromFirestore<ProductTypeObject>(
          COLLECTION_NAME.PRODUCT_TYPES,
          product.productType_id
        );

        imageUrls = await Promise.all(
          product.images.map(async (image) => {
            const url = await getDownloadUrlFromFirebaseStorage(image);

            return {
              path: image,
              url,
            };
          })
        );
      } catch (error) {
        console.log(error);
      }

      return {
        ...product,
        productTypeName: productType?.name ?? '',
        imageUrls: imageUrls,
      } as StorageProductObject;
    })
  );

  return storageProducts;
};

export interface StorageBatchObject extends BatchObject {
  productName: string;
  productIsActive: boolean;
  productTypeName: string;
  productTypeIsActive: boolean;
  material: string;
  size: string;
  price: number;
}

export const fetchBatchesForStoragePage = async (): Promise<
  StorageBatchObject[]
> => {
  const batches = await getCollection<BatchObject>(COLLECTION_NAME.BATCHES);

  const storageBatches = await Promise.all(
    batches.map(async (batch) => {
      let product: ProductObject | null = null;

      try {
        product = await getDocFromFirestore<ProductObject>(
          COLLECTION_NAME.PRODUCTS,
          batch.product_id
        );
      } catch (error) {
        console.log(error);
        product = null;
      }

      let productType: ProductTypeObject | null = null;

      if (product) {
        try {
          productType = await getDocFromFirestore<ProductTypeObject>(
            COLLECTION_NAME.PRODUCT_TYPES,
            product.productType_id
          );
        } catch (error) {
          console.log(error);
        }
      }

      const variant = product?.variants.find(
        (variant) => variant.id === batch.variant_id
      );

      let discountDate: Date | null = null;

      try {
        discountDate = (batch.discount.date as unknown as Timestamp).toDate();
      } catch (error) {
        console.log(error);
      }

      return {
        ...batch,
        productName: product?.name ?? '',
        productIsActive: product?.isActive ?? false,
        productTypeName: productType?.name ?? '',
        productTypeIsActive: productType?.isActive ?? false,
        material: variant?.material ?? '',
        size: variant?.size ?? '',
        price: variant?.price ?? 0,
        discount: {
          ...batch.discount,
          date: discountDate,
        },
      } as StorageBatchObject;
    })
  );

  return storageBatches;
};

//#endregion

//#region Product Types

export async function getProductTypeWithCount(type: ProductTypeObject) {
  const typeWithCount: ProductTypeWithCount = {
    ...type,
    count: await countDocs(
      COLLECTION_NAME.PRODUCTS,
      where('productType_id', '==', type.id)
    ),
  };

  return typeWithCount;
}

export async function getProductTypeWithCountById(id: string) {
  if (!id) throw new Error('Null ID');

  const productType = await getDocFromFirestore<ProductTypeObject>(
    COLLECTION_NAME.PRODUCT_TYPES,
    id
  );

  const typeWithCount: ProductTypeWithCount = {
    ...productType,
    count: await countDocs(
      COLLECTION_NAME.PRODUCTS,
      where('productType_id', '==', productType.id)
    ),
  };

  return typeWithCount;
}

//#endregion

//#region Product

/**
 * Get products by product type id
 * @param id - The id of the product
 * @returns Promise<ProductObject[]> - The products
 */
export async function getProductsByType(id: string): Promise<ProductObject[]> {
  if (!id) throw new Error('Id is null');

  const products = await getCollectionWithQuery<ProductObject>(
    COLLECTION_NAME.PRODUCTS,
    where('productType_id', '==', id)
  );

  return products;
}

//#endregion
