import Product, { ProductDetail, productConverter } from '@/models/product';
import {
  DocumentReference,
  DocumentSnapshot,
  QueryConstraint,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';
import {
  getProductTypeById,
  getProductTypes,
  getProductTypesRef,
  getProductTypesSnapshot,
} from './productTypeDAO';
import { getBatchById } from './batchDAO';
import { VariantTableRow } from '@/models/variant';
import { getVariants } from './variantDAO';
import Batch from '@/models/batch';
import { FeedbackTableRow } from '@/models/feedback';
import { getFeedbacks } from './feedbackDAO';
import { getUser } from './userDAO';
import Color from '@/models/color';
import { getColorById } from './colorDAO';
import { ProductTypeTableRow } from '@/models/productType';

export function getProductsRef(productTypeId: string) {
  return collection(
    getProductTypesRef(),
    productTypeId,
    COLLECTION_NAME.PRODUCTS
  ).withConverter(productConverter);
}

export function getProductsRefWithQuery(
  productTypeId: string,
  ...queryConstraints: QueryConstraint[]
) {
  return query(
    getProductsRef(productTypeId),
    ...queryConstraints
  ).withConverter(productConverter);
}

export function getProductRef(productTypeId: string, id: string) {
  return doc(getProductsRef(productTypeId), id).withConverter(productConverter);
}

export async function getProductsSnapshot(productTypeId: string) {
  return await getDocs(getProductsRef(productTypeId));
}

export async function getProducts(productTypeId: string) {
  return (await getProductsSnapshot(productTypeId)).docs.map((doc) =>
    doc.data()
  );
}

export async function getAllProductSnapshots(): Promise<
  DocumentSnapshot<Product>[]
> {
  const productTypesQuerySnapshots = (await getProductTypesSnapshot()).docs;

  const productSnapshots: DocumentSnapshot<Product>[] = [];

  for (const productTypeQuerySnapshot of productTypesQuerySnapshots) {
    productSnapshots.push(
      ...(await getProductsSnapshot(productTypeQuerySnapshot.id)).docs
    );
  }

  return productSnapshots;
}

export async function getAllProducts() {
  const productTypes = await getProductTypes();

  const allProducts: Product[] = [];

  for (const type of productTypes) {
    allProducts.push(...(await getProducts(type.id)));
  }

  return allProducts;
}

export async function getProductsSnapshotWithQuery(
  productTypeId: string,
  ...queryConstraints: QueryConstraint[]
) {
  return await getDocs(
    getProductsRefWithQuery(productTypeId, ...queryConstraints)
  );
}

export async function getProductsWithQuery(
  productTypeId: string,
  ...queryConstraints: QueryConstraint[]
) {
  return (
    await getProductsSnapshotWithQuery(productTypeId, ...queryConstraints)
  ).docs.map((doc) => doc.data());
}

export async function getProductSnapshot(productTypeId: string, id: string) {
  return await getDoc(getProductRef(productTypeId, id));
}

export async function getProduct(productTypeId: string, id: string) {
  return (await getProductSnapshot(productTypeId, id)).data();
}

export async function updateProduct(
  productTypeId: string,
  id: string,
  data: Product
) {
  return await updateDoc(getProductRef(productTypeId, id), data);
}

export async function createProduct(
  productTypeId: string,
  data: Omit<Product, 'id'>
): Promise<DocumentReference<Omit<Product, 'id'>> | undefined>;
export async function createProduct(
  productRef: DocumentReference<Product>,
  data: Omit<Product, 'id'>
): Promise<DocumentReference<Omit<Product, 'id'>> | undefined>;
export async function createProduct(
  arg1: string | DocumentReference<Product>,
  data: Omit<Product, 'id'>
): Promise<DocumentReference<Omit<Product, 'id'>> | undefined> {
  if (typeof arg1 === 'string') {
    return await addDoc(getProductsRef(arg1), data);
  } else {
    await setDoc(arg1, data);
  }
}

export async function deleteProduct(productTypeId: string, id: string) {
  return await deleteDoc(getProductRef(productTypeId, id));
}

export async function getProductDetail(batch_id: string) {
  let batch = await getBatchById(batch_id);
  if (!batch) {
    return;
  }

  let product = await getProduct(batch.product_type_id, batch.product_id);

  if (!product) {
    return;
  }
  // type ProductDetail = Product & {
  //   variants?: VariantTableRow[];
  //   feedbacks?: FeedbackTableRow[];
  //   colorObjects?: Color[];
  //   productType?: ProductTypeTableRow;
  // };

  // variants
  let variantTableRows: VariantTableRow[] = [];
  let variants = await getVariants(batch.product_type_id, batch.product_id);
  await Promise.all(
    variants.map(async (variant) => {
      const batches: Batch[] = [];
      await Promise.all(
        variant.batches.map(async (batch) => {
          let b = await getBatchById(batch);

          if (b && b.quantity - b.sold > 0 && b.exp > new Date()) {
            batches.push(b);
            console.log(batches);
          }
        })
      );

      if (batches.length > 0) {
        variantTableRows.push({
          ...variant,
          batcheObjects: batches,
        });
      }
    })
  );

  // feedbacks
  let feebackTableRows: FeedbackTableRow[] = [];
  let feebacks = await getFeedbacks(batch.product_type_id, batch.product_id);
  await Promise.all(
    feebacks.map(async (feedback) => {
      let user = await getUser(feedback.product_id, feedback.user_id);
      feebackTableRows.push({
        ...feedback,
        user: user,
      });
    })
  );

  // colorObjects
  let colorObjects: Color[] = [];
  await Promise.all(
    product?.colors.map(async (color) => {
      let c = await getColorById(color);
      if (c) {
        colorObjects.push(c);
      }
    })
  );

  // productTypeTableRow yêu ai?
  let productType = await getProductTypeById(batch.product_type_id);
  if (!productType) {
    return;
  }
  let products = (await getProducts(batch.product_type_id)).filter(
    (product) => product.id != batch!.product_id
  );
  let productTypeTableRow: ProductTypeTableRow = {
    ...productType,
    products: products,
  };

  const productDetail: ProductDetail = {
    ...product,
    variants: variantTableRows,
    feedbacks: feebackTableRows,
    colorObjects: colorObjects,
    productType: productTypeTableRow,
  };

  return productDetail;
}
