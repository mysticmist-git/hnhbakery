import { withHashCacheAsync } from '@/utils/withHashCache';
import { COLLECTION_NAME, ROUTES } from './constants';
import {
  checkBatchDiscounted,
  getDocFromFirestore,
  getDownloadUrlFromFirebaseStorage,
  getTotalSoldOfProduct,
} from './firestore';
import {
  BatchObject,
  BatchObjectWithDiscount,
  BatchObjectWithPrice,
  ProductObject,
  ProductTypeObject,
  ProductVariant,
} from './models';
import { AssembledProduct, ProductForProductsPage } from './types/products';
import { filterDuplicatesById } from './utils';

export function valueComparer(a: number, b: number) {
  console.log(a, b);

  if (a > b) {
    return -1;
  }
  if (a < b) {
    return 1;
  }
  return 0;
}

async function createProductsOnProductsPage(
  batches: BatchObject[]
): Promise<ProductForProductsPage[]> {
  const promises = batches.map(async (b) => {
    const product = await getDocFromFirestore<ProductObject>(
      COLLECTION_NAME.PRODUCTS,
      b.product_id
    );

    let variant: ProductVariant = {
      id: '',
      material: '',
      size: '',
      price: 0,
      isActive: true,
    };

    variant = product.variants.find((v) => v.id === b.variant_id) ?? variant;

    const discounted: boolean = checkBatchDiscounted(b);
    const price = variant?.price ?? 0;
    let discountPrice = 0;

    if (discounted) {
      discountPrice = (price * (100 - b.discount.percent)) / 100;
    }

    const image = await getDownloadUrlFromFirebaseStorage(product.images[0]);
    const href = `${ROUTES.PRODUCT_DETAIL}?id=${b.product_id}`;
    const totalSoldQuantity = await getTotalSoldOfProduct(b.product_id);

    const type = await getDocFromFirestore<ProductTypeObject>(
      COLLECTION_NAME.PRODUCT_TYPES,
      product.productType_id
    );

    // Order is important because of Ids is overlap
    const result: ProductForProductsPage = {
      ...product,
      ...variant,
      ...b,
      discounted,
      discountPrice,
      image,
      href,
      totalSoldQuantity,
      typeName: type.name,
    };

    return result;
  });

  let result = await Promise.all(promises);

  return result;
}

export const cachedCreateProductsOnProductsPage = withHashCacheAsync(
  createProductsOnProductsPage
);
