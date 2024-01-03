import { getAvailableProductTypeTableRows } from '@/lib/DAO/productTypeDAO';
import CustomerReference from '@/models/CustomerReference';
import Feedback from '@/models/feedback';
import Product, { ProductTableRow } from '@/models/product';
import { ProductTypeTableRow } from '@/models/productType';
import Variant from '@/models/variant';
import { useEffect, useState } from 'react';

export type RecommendCardType = ProductTableRow & {
  variant: Variant;
  feedbacks?: Feedback[];
  matchPercent?: number;
};

function countSameItems(arrayA: string[], arrayB: string[]) {
  return arrayA.filter((x) => arrayB.includes(x)).length;
}

function matchPercent(ref: CustomerReference, item: RecommendCardType) {
  const rate = {
    price: 0.3,
    productType: 0.2,
    color: 0.2,
    size: 0.3,
  };

  let price: number = 0;
  const distance = 3 * 50000; // chênh lệch với giá đã chọn
  if (
    item.variant.price >= ref.prices.min &&
    item.variant.price <= ref.prices.max
  ) {
    price = 100;
  } else if (item.variant.price < ref.prices.min) {
    const x = item.variant.price;
    const min = Math.max(0, ref.prices.min - distance);
    const max = ref.prices.min;
    if (x <= min) {
      price = 0;
    } else price = Math.round(((x - min) / (max - min)) * 100);
  } else if (item.variant.price > ref.prices.max) {
    const x = item.variant.price;
    const min = ref.prices.max;
    const max = Math.max(ref.prices.max + distance, x);
    if (x >= max) {
      price = 0;
    } else price = Math.round(((max - x) / (max - min)) * 100);
  }

  let productType: number = [item.product_type_id].some((x) =>
    ref.productTypeIds.includes(x)
  )
    ? 100
    : 0;

  let color: number =
    Math.round(countSameItems(item.colors, ref.colors) / ref.colors.length) *
    100;

  let size: number = [item.variant.size].some((x) => ref.sizes.includes(x))
    ? 100
    : 0;

  let total =
    price * rate.price +
    productType * rate.productType +
    color * rate.color +
    size * rate.size;

  return total;
}

function useRecommendVariants(
  customerReferenceData: CustomerReference | undefined
) {
  const [data, setData] = useState<RecommendCardType[]>([]);

  useEffect(() => {
    async function fetch() {
      const ref = customerReferenceData;
      if (!ref) {
        return;
      }

      const productTypes: ProductTypeTableRow[] =
        await getAvailableProductTypeTableRows();

      let products: ProductTableRow[] = productTypes
        .flatMap((productType) => productType.products)
        .filter(
          (product) =>
            product != undefined && product.images.length > 0 && product.active
        ) as ProductTableRow[];

      const result: RecommendCardType[] = products
        .map(
          (product) =>
            product.variants?.map((variant) => {
              const { variants, ...p } = product;
              return {
                ...p,
                variant,
              };
            }) as RecommendCardType[]
        )
        .flat();
      result.forEach((product) => {
        product.matchPercent = matchPercent(ref, product);
      });

      result.sort((a, b) => b.matchPercent! - a.matchPercent!);

      console.log(result);
      setData(result.filter((x) => x.matchPercent! >= 20));
    }
    fetch();
  }, [customerReferenceData]);

  return data;
}

export default useRecommendVariants;
