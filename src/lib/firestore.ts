import { db, storage } from '@/firebase/config';
import { withHashCache, withHashCacheAsync } from '@/utils/withHashCache';
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
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { nanoid } from 'nanoid';
import { COLLECTION_NAME, DETAIL_PATH } from './constants';
import {
  BaseObject,
  BatchObject,
  Contact,
  PathWithUrl,
  ProductObject,
  ProductTypeObject,
  ProductTypeWithCount,
  ProductVariant,
  StorageBatchObject,
  StorageProductObject,
  StorageProductTypeObject,
} from './models';
import { AssembledProduct } from './types/products';
import { filterDuplicates } from './utils';

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

export async function addDocToFirestoreWithRef(
  ref: DocumentReference,
  data: BaseObject
): Promise<void> {
  await setDoc(ref, data);
}

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
  imagePath: string,
  imageFile: File
): Promise<string> => {
  const storageRef = ref(storage, imagePath);

  const result = await uploadBytes(storageRef, imageFile);
  const path = result.metadata.fullPath;

  return path;
};

/**
 * This function is used specificially for products ONLY.
 * @param imageFiles - The image files to upload.
 * @returns paths
 */
export const uploadImagesToFirebaseStorage = async (
  galleryPath: string,
  imageFiles: File[]
): Promise<string[]> => {
  const paths = Promise.all(
    imageFiles.map(async (file) => {
      const storageRef = ref(storage, `${galleryPath}/${nanoid(4)}`);

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

export async function deleteImageFromFirebaseStorage(imagePath: string) {
  const storageRef = ref(storage, imagePath);

  deleteObject(storageRef);
}

export async function deleteImagesFromFirebaseStorage(paths: string[]) {
  paths.forEach((path) => {
    deleteImageFromFirebaseStorage(path);
  });
}

export const getDownloadUrlsFromFirebaseStorage = withHashCacheAsync(
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

export const getDownloadUrlFromFirebaseStorage = withHashCacheAsync(
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
        data[key] = new Date(data[key].toDate());
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
      data[key] = new Date(data[key].toDate());
    }
  });

  return { ...data, id: docSnapshot.id } as T;
}

export async function getBestSellterProducts(): Promise<ProductObject[]> {
  // Constants
  const minSoldQuantity = 5;
  const queryLimit = 7;

  const batches = await getBatchesWithQuery(
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
    COLLECTION_NAME.PRODUCTS,
    where(documentId(), 'in', productIds)
  );

  if (!products) return [];

  return products;
}

//#endregion

// #region Contact

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

export const fetchProductTypesForStoragePage = async (): Promise<
  StorageProductTypeObject[]
> => {
  const productTypes = await getCollection<ProductTypeObject>(
    COLLECTION_NAME.PRODUCT_TYPES
  );

  const storageProductTypes = await Promise.all(
    productTypes.map(async (type) => {
      let productCount = 0;
      let imageURL = '';

      try {
        productCount = await countDocs(
          COLLECTION_NAME.PRODUCTS,
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
        imageUrls: imageUrls,
      } as StorageProductObject;
    })
  );

  return storageProducts;
};

export async function fetchBatchForStoragePage(batch: BatchObject) {
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

  return {
    ...batch,
    productType_id: productType?.id ?? '',
    material: variant?.material ?? '',
    size: variant?.size ?? '',
    price: variant?.price ?? 0,
  } as StorageBatchObject;
}

export const fetchBatchesForStoragePage = async (): Promise<
  StorageBatchObject[]
> => {
  const batches = await getBatches();

  const storageBatches = await Promise.all(
    batches.map(async (batch) => {
      return await fetchBatchForStoragePage(batch);
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

//#region Local Functions

export async function fetchAvailableBatches(): Promise<BatchObject[]> {
  try {
    let batches = await getBatchesWithQuery(
      where('EXP', '>=', Timestamp.now())
    );

    batches = batches.filter(
      (batch) => batch.soldQuantity < batch.totalQuantity
    );

    console.log(batches);
    return batches;
  } catch (error) {
    console.log('Error at fetchAvailableBatches:', error);
    return [];
  }
}

export type LowestPriceAndItsMFGProductId = {
  id: string;
  price: number;
  MFG: Date;
};

export function calculateTotalSoldQuantity(batches: BatchObject[]): number {
  return batches.reduce((acc: number, batch: BatchObject) => {
    return acc + batch.soldQuantity;
  }, 0);
}

//#endregion

type GetBelongBatchesStrategy = (
  productId: string,
  batches?: BatchObject[]
) => Promise<BatchObject[]>;

const getBelongBatchesWithExistedBatches: GetBelongBatchesStrategy = async (
  productId,
  batches
) => {
  if (!productId || !batches) return [];

  const belongBatches = (batches as BatchObject[]).filter(
    (b) => b.product_id === productId
  );

  return belongBatches;
};

const getBelongBatchesWithProductId: GetBelongBatchesStrategy = async (
  productId,
  batches
) => {
  if (!productId) return [];

  // Get all batches that have not expired
  let belongBatches = await getBatchesWithQuery(
    where('product_id', '==', productId)
  );

  // Combine the results
  belongBatches = belongBatches
    .filter((b) => b.EXP.getTime() > new Date().getTime())
    .filter((b) => b.totalQuantity > b.soldQuantity);

  return belongBatches;
};

export function checkBatchDiscounted(batch: BatchObject): boolean {
  return new Date().getTime() > batch.discount.date.getTime();
}

export async function assembleProduct(
  product: ProductObject,
  batches?: BatchObject[]
): Promise<AssembledProduct> {
  const type = await getDocFromFirestore<ProductTypeObject>(
    COLLECTION_NAME.PRODUCT_TYPES,
    product.productType_id
  );

  const getBelongBatches: GetBelongBatchesStrategy = batches
    ? getBelongBatchesWithExistedBatches
    : getBelongBatchesWithProductId;

  let discounted = false;

  let belongBatches = await getBelongBatches(product.id, batches);

  const checkedBelongBatches = belongBatches.map((b) => {
    const batchDiscounted = checkBatchDiscounted(b);

    if (batchDiscounted) discounted = true;

    return {
      ...b,
      discounted: batchDiscounted,
    };
  });

  const belongBatchesIds = belongBatches.map((b) => b.variant_id);

  const assembledProduct: AssembledProduct = {
    ...product,
    images: await getDownloadUrlsFromFirebaseStorage(product.images),
    type: type,
    batches: checkedBelongBatches,
    totalSoldQuantity: calculateTotalSoldQuantity(belongBatches),
    variants: product.variants.filter((v) => belongBatchesIds.includes(v.id)),
    href: `/${DETAIL_PATH}?id=${product.id}`,
    hasDiscounted: discounted,
  };

  return assembledProduct;
}

export const fetchAssembledProduct = async (
  id: string
): Promise<AssembledProduct> => {
  const product = await getDocFromFirestore<ProductObject>(
    COLLECTION_NAME.PRODUCTS,
    id
  );

  const assembledProduct = await assembleProduct(product);

  return assembledProduct;
};

/**
 * Get total sold quantity of a product
 * @param id - The id of the product
 */
export async function getTotalSoldOfProduct(id: string): Promise<number> {
  const batches = await getCollectionWithQuery<BatchObject>(
    COLLECTION_NAME.BATCHES,
    where('product_id', '==', id)
  );

  return await calculateTotalSoldQuantity(batches);
}

//#endregion

//#region Batch

export const getBatches = async (): Promise<BatchObject[]> => {
  let batches = await getCollection<BatchObject>(COLLECTION_NAME.BATCHES);

  batches = batches.map((batch) => {
    return {
      ...batch,
      discount: {
        ...batch.discount,
        date: new Date((batch.discount.date as unknown as Timestamp).toDate()),
      },
    };
  });

  return batches;
};

export const getBatchesWithQuery = async (
  ...queryConstraints: QueryConstraint[]
): Promise<BatchObject[]> => {
  let batches = await getCollectionWithQuery<BatchObject>(
    COLLECTION_NAME.BATCHES,
    ...queryConstraints
  );

  batches = batches.map((batch) => {
    return {
      ...batch,
      discount: {
        ...batch.discount,
        date: new Date((batch.discount.date as unknown as Timestamp).toDate()),
      },
    };
  });

  return batches;
};

//#endregion
