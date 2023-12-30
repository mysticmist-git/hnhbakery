import Batch from '@/models/batch';
import Bill, { BillTableRow } from '@/models/bill';
import { ProductTypeTableRow } from '@/models/productType';
import { MainTabBatch, MainTabData } from '@/pages/manager/reports';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { Interval, IntervalType } from '../types/report';
dayjs.extend(weekOfYear);

const REPORT_CONSTANT = {
  EACH_INTERVAL_RANGE: 5,
};

export function getFromDateToDateText(from: Date, to: Date) {
  // Check null
  if (!from || !to) return 'Đang tải khoảng thời gian';
  if (dayjs(from).isSame(to, 'day')) {
    return `Ngày ${dayjs(from).format('DD/MM/YYYY')}`;
  }
  return `${dayjs(from).format('DD/MM/YYYY')} - ${dayjs(to).format(
    'DD/MM/YYYY'
  )}`;
}
export function resolveIntervalLabel(
  index: number,
  type: IntervalType
): string {
  switch (type) {
    case 'week':
      return resolveWeekIntervalLabel(index);
    case 'month':
      return resolveMonthIntervalLabel(index);
    case 'year':
      return resolveYearIntervalLabel(index);
    default:
      return `Lỗi!`;
  }
}
export function resolveWeekIntervalLabel(index: number): string {
  if (index === 0) return 'Tuần này';
  if (index === -1) return 'Tuần trước';
  if (index === 1) return 'Tuần sau';

  return `W${dayjs().add(index, 'week').week()}`;
}
export function resolveMonthIntervalLabel(index: number): string {
  if (index === 0) return 'Tháng này';
  if (index === -1) return 'Tháng trước';
  if (index === 1) return 'Tháng sau';

  return dayjs().add(index, 'month').format('MM/YYYY');
}
export function resolveYearIntervalLabel(index: number): string {
  if (index === 0) return 'Năm nay';
  if (index === -1) return 'Năm trước';
  if (index === 1) return 'Năm sau';

  return dayjs().add(index, 'year').format('YYYY');
}
export function initIntervals(intervalType: IntervalType): Interval[] {
  const initializedIntervals: Interval[] = [];
  switch (intervalType) {
    case 'week':
      for (
        let i = -REPORT_CONSTANT.EACH_INTERVAL_RANGE;
        i <= REPORT_CONSTANT.EACH_INTERVAL_RANGE;
        i++
      ) {
        initializedIntervals.push({
          index: i,
          type: 'week',
          label: resolveIntervalLabel(i, 'week'),
          from: dayjs().add(i, 'week').startOf('week').toDate(),
          to: dayjs().add(i, 'week').endOf('week').toDate(),
        });
      }
      break;
    case 'month':
      for (
        let i = -REPORT_CONSTANT.EACH_INTERVAL_RANGE;
        i <= REPORT_CONSTANT.EACH_INTERVAL_RANGE;
        i++
      ) {
        initializedIntervals.push({
          index: i,
          type: 'month',
          label: resolveIntervalLabel(i, 'month'),
          from: dayjs().add(i, 'month').startOf('month').toDate(),
          to: dayjs().add(i, 'month').endOf('month').toDate(),
        });
      }
      break;
    case 'year':
      for (
        let i = -REPORT_CONSTANT.EACH_INTERVAL_RANGE;
        i <= REPORT_CONSTANT.EACH_INTERVAL_RANGE;
        i++
      ) {
        initializedIntervals.push({
          index: i,
          type: 'year',
          label: resolveIntervalLabel(i, 'year'),
          from: dayjs().add(i, 'year').startOf('year').toDate(),
          to: dayjs().add(i, 'year').endOf('year').toDate(),
        });
      }
      break;
    default:
      break;
  }
  return initializedIntervals;
}
export function getUpdatedIntervals(
  intervalType: IntervalType,
  intervals: Interval[],
  intervalIndex: number
): [boolean, Interval[]] {
  let updatedIntervals: Interval[] = [];
  let change = false;

  if (intervalIndex <= intervals[0].index) {
    updatedIntervals = getUpdatedLeftIntervals(intervals);
    change = true;
  } else if (intervalIndex >= intervals[intervals.length - 1].index) {
    updatedIntervals = getUpdatedRightIntervals(intervals);
    change = true;
  }

  return [change, updatedIntervals];
}
export function getUpdatedLeftIntervals(intervals: Interval[]) {
  const cloneToUpdateIntervals = [...intervals];
  const type = intervals[0].type;
  for (
    let i = intervals[0].index - 1;
    i >= intervals[0].index - REPORT_CONSTANT.EACH_INTERVAL_RANGE;
    i--
  ) {
    cloneToUpdateIntervals.unshift({
      index: i,
      type: type,
      label: resolveIntervalLabel(i, type),
      from: dayjs().add(i, type).startOf(type).toDate(),
      to: dayjs().add(i, type).endOf(type).toDate(),
    });
  }

  return cloneToUpdateIntervals;
}
export function getUpdatedRightIntervals(intervals: Interval[]) {
  const cloneToUpdateIntervals = [...intervals];
  const type = intervals[intervals.length - 1].type;
  for (
    let i = intervals[intervals.length - 1].index + 1;
    i <=
    intervals[intervals.length - 1].index + REPORT_CONSTANT.EACH_INTERVAL_RANGE;
    i++
  ) {
    cloneToUpdateIntervals.push({
      index: i,
      type: type,
      label: resolveIntervalLabel(i, type),
      from: dayjs().add(i, type).startOf(type).toDate(),
      to: dayjs().add(i, type).endOf(type).toDate(),
    });
  }

  return cloneToUpdateIntervals;
}
export function getMainTabData(
  bills: BillTableRow[],
  batches: Batch[]
): MainTabData {
  const mainTabData: MainTabData = {
    revenue: getMainTabRevenue(bills),
    batch: getMainTabBatch(batches),
  };
  return mainTabData;
}
export function getMainTabRevenue(bills: BillTableRow[]) {
  return {
    totalRevenue: bills
      .map((bill) => bill.total_price)
      .reduce((a, b) => a + b, 0),
    saleAmount: bills.map((bill) => bill.sale_price).reduce((a, b) => a + b, 0),
    finalRevenue: bills
      .map((bill) => bill.final_price)
      .reduce((a, b) => a + b, 0),
  };
}
export function getMainTabBatch(batches: Batch[]): MainTabBatch {
  const [sold, quantity] = batches.reduce(
    (acc, cur) => [acc[0] + cur.sold, acc[1] + cur.quantity],
    [0, 0]
  );
  return {
    totalBatch: batches.length,
    quantity: quantity,
    soldCake: sold,
    soldCakePercent: Math.floor((sold / quantity) * 100) || 0,
  };
}
export function getRevenueTabChartData(
  bills: BillTableRow[],
  interval: Interval
): [number[], number[], number[]] {
  switch (interval.type) {
    case 'week':
    case 'month': {
      const numberOfDays = dayjs(interval.to).diff(dayjs(interval.from), 'day');
      const totalRevenues = new Array(numberOfDays + 1).fill(0);
      const saleAmounts = new Array(numberOfDays + 1).fill(0);
      const finalRevenues = new Array(numberOfDays + 1).fill(0);

      for (let i = 0; i < numberOfDays; i++) {
        const date = dayjs(interval.from).add(i, 'day');
        const [totalRevenue, saleAmount, finalRevenue] = bills.reduce(
          (acc, cur) => {
            if (dayjs(cur.created_at).isSame(date, 'day')) {
              return [
                acc[0] + cur.total_price,
                acc[1] + cur.sale_price,
                acc[2] + cur.final_price,
              ];
            }
            return acc;
          },
          [0, 0, 0]
        );
        totalRevenues[i] = totalRevenue;
        saleAmounts[i] = saleAmount;
        finalRevenues[i] = finalRevenue;
      }
      return [totalRevenues, saleAmounts, finalRevenues];
    }
    case 'year': {
      const numberOfDays = dayjs(interval.to).diff(
        dayjs(interval.from),
        'month'
      );
      const totalRevenues = new Array(numberOfDays + 1).fill(0);
      const saleAmounts = new Array(numberOfDays + 1).fill(0);
      const finalRevenues = new Array(numberOfDays + 1).fill(0);

      for (let i = 0; i < numberOfDays; i++) {
        const date = dayjs(interval.from).add(i, 'month');
        const [totalRevenue, saleAmount, finalRevenue] = bills.reduce(
          (acc, cur) => {
            if (dayjs(cur.created_at).isSame(date, 'month')) {
              return [
                acc[0] + cur.total_price,
                acc[1] + cur.sale_price,
                acc[2] + cur.final_price,
              ];
            }
            return acc;
          },
          [0, 0, 0]
        );
        totalRevenues[i] = totalRevenue;
        saleAmounts[i] = saleAmount;
        finalRevenues[i] = finalRevenue;
      }
      return [totalRevenues, saleAmounts, finalRevenues];
    }
    default:
      return [[0], [0], [0]];
  }
}
export function getBranchRevenueData(bills: BillTableRow[]): BranchRevenue {
  let result = bills.reduce((result: BranchRevenue, bill) => {
    if (!result[bill.branch_id]) {
      result[bill.branch_id] = {
        revenue: 0,
        percent: 0,
      };
    }

    result[bill.branch_id].revenue += bill.final_price;

    return result;
  }, {});
  const totalRevenue = Object.values(result).reduce(
    (acc, cur) => acc + cur.revenue,
    0
  );
  Object.entries(result).forEach(([key, value]) => {
    result[key].percent = (value.revenue / totalRevenue) * 100;
  });
  return result;
}
export type BranchRevenue = {
  [key: string]: {
    revenue: number;
    percent: number;
  };
};
export type RevenueAndPercent = {
  revenue: number;
  percent: number;
};
export type ProductTypeRevenue = {
  [key: string]: RevenueAndPercent & { name: string; image: string } & {
    products: ProductRevenue;
  };
};
export type ProductRevenue = {
  [key: string]: RevenueAndPercent & { name: string; image: string } & {
    variants: VariantRevenue;
  };
};
export type VariantRevenue = {
  [key: string]: RevenueAndPercent & { material: string; size: string };
};
export function getProductTypeRevenueData(
  bills: BillTableRow[]
): ProductTypeRevenue {
  const productTypeRevenue: ProductTypeRevenue = {};
  bills.forEach((bill) =>
    bill.billItems?.map((item) => {
      if (!productTypeRevenue[item.productType?.id!]) {
        productTypeRevenue[item.productType?.id!] = {
          name: item.productType?.name!,
          image: item.productType?.image!,
          revenue: 0,
          percent: 0,
          products: {},
        };
      }
      productTypeRevenue[item.productType?.id!].revenue += item.total_price;

      if (
        !productTypeRevenue[item.productType?.id!].products[item.product?.id!]
      ) {
        productTypeRevenue[item.productType?.id!].products[item.product?.id!] =
          {
            name: item.product?.name!,
            image: item.product?.images[0]!,
            revenue: 0,
            percent: 0,
            variants: {},
          };
      }

      productTypeRevenue[item.productType?.id!].products[
        item.product?.id!
      ].revenue += item.total_price;

      if (
        !productTypeRevenue[item.productType?.id!].products[item.product?.id!]
          .variants[item.variant?.id!]
      ) {
        productTypeRevenue[item.productType?.id!].products[
          item.product?.id!
        ].variants[item.variant?.id!] = {
          material: item.variant?.material!,
          size: item.variant?.size!,
          revenue: 0,
          percent: 0,
        };
      }

      productTypeRevenue[item.productType?.id!].products[
        item.product?.id!
      ].variants[item.variant?.id!].revenue += item.total_price;
    })
  );
  if (Object.keys(productTypeRevenue).length === 0) {
    return productTypeRevenue;
  }

  const totalRevenue = Object.values(productTypeRevenue).reduce(
    (acc, cur) => acc + cur.revenue,
    0
  );

  let totalPercentSum = 0;

  for (const productTypeKey in productTypeRevenue) {
    const productType = productTypeRevenue[productTypeKey];
    productType.percent = Math.floor(
      (productType.revenue * 100) / totalRevenue
    );

    let productTypePercentSum = 0;

    for (const productKey in productType.products) {
      const product = productType.products[productKey];
      product.percent = Math.floor(
        (product.revenue * 100) / productType.revenue
      );

      let productPercentSum = 0;

      for (const variantKey in product.variants) {
        const variant = product.variants[variantKey];
        variant.percent = Math.floor((variant.revenue * 100) / product.revenue);

        productPercentSum += variant.percent;
      }

      // Adjust the last variant's percentage to ensure it adds up to 100
      const lastVariantKey = Object.keys(product.variants).pop()!;
      product.variants[lastVariantKey].percent += 100 - productPercentSum;

      productTypePercentSum += product.percent;
    }

    // Adjust the last product's percentage to ensure it adds up to 100
    const lastProductKey = Object.keys(productType.products).pop()!;
    productType.products[lastProductKey].percent += 100 - productTypePercentSum;

    totalPercentSum += productType.percent;
  }

  // Adjust the last product type's percentage to ensure it adds up to 100
  const lastProductTypeKey = Object.keys(productTypeRevenue).pop()!;
  productTypeRevenue[lastProductTypeKey].percent += 100 - totalPercentSum;

  return productTypeRevenue;
}

export type GeneralBatchItemData = {
  id: string;
  name: string;
  image?: string;
  data: GeneralBatchData;
};
export type GeneralBatchData = {
  totalBatch: number;
  totalBatchPercent: number;
  quantity: number;
  quantityPercent: number;
  soldCake: number;
  soldCakeToQuantityPercent: number;
  soldCakePercent: number;
};

export type WithGeneralBatchData<T> = T & GeneralBatchItemData;

export type BatchTabData = Pick<
  GeneralBatchData,
  'totalBatch' | 'quantity' | 'soldCake' | 'soldCakePercent'
> & { productTypes: ProductTypeBatchData[] };
export type ProductTypeBatchData = WithGeneralBatchData<{
  products: ProductBatchData[];
}>;
export type ProductBatchData = WithGeneralBatchData<{
  variants: VariantBatchData[];
}>;
export type VariantBatchData = Omit<
  WithGeneralBatchData<{
    id: string;
    material: string;
    size: string;
    batches: (Batch & {
      quantityPercent: number;
      soldCakePercent: number;
      soldCakeToQuantityPercent: number;
    })[];
  }>,
  'name' | 'image'
>;

export function getBatchTabData(
  productTypes: ProductTypeTableRow[],
  batches: Batch[]
): BatchTabData {
  const groupedBatches = getGroupedBatches(batches);

  const batchTabData = getDefaultBatchTabData(productTypes); // We will fill this data later

  for (let i = 0; i < batchTabData.productTypes.length; i++) {
    const type = batchTabData.productTypes[i];
    if (!groupedBatches.has(type.id)) continue;

    for (let j = 0; j < type.products!.length; j++) {
      const product = type.products![j];
      if (!groupedBatches.get(type.id)!.has(product.id)) continue;

      for (let k = 0; k < productTypes[i].products![j].variants!.length; k++) {
        const variant = product.variants![k];
        if (
          !groupedBatches.get(type.id)!.get(product.id)!.has(variant.id) ||
          groupedBatches.get(type.id)!.get(product.id)!.get(variant.id)!
            .length <= 0
        )
          continue;

        variant.batches =
          groupedBatches
            .get(type.id)!
            .get(product.id)!
            .get(variant.id)!
            .map((batch) => {
              variant.data.soldCake += batch.sold;
              variant.data.quantity += batch.quantity;
              return {
                ...batch,
                soldCakeToQuantityPercent: Math.floor(
                  (batch.sold / batch.quantity) * 100
                ),
              } as (typeof variant.batches)[0];
            }) || [];

        // Calculate sold cake percent
        variant.data.totalBatch = variant.batches.length;
        variant.data.soldCakeToQuantityPercent =
          Math.floor((variant.data.soldCake / variant.data.quantity) * 100) ||
          0;

        variant.batches = variant.batches.map((batch) => {
          batch.quantityPercent =
            Math.floor((batch.quantity / variant.data.quantity) * 100) || 0;
          batch.soldCakePercent =
            Math.floor((batch.sold / variant.data.quantity) * 100) || 0;
          return batch;
        });

        // Update product data
        product.data.totalBatch += variant.data.totalBatch;
        product.data.soldCake += variant.data.soldCake;
        product.data.quantity += variant.data.quantity;
      }
      // Calculate children percent data after parent gets needed data
      for (let k = 0; k < productTypes[i].products![j].variants!.length; k++) {
        const variant = product.variants![k];
        if (!groupedBatches.get(type.id)!.get(product.id)!.has(variant.id))
          continue;
        variant.data.totalBatchPercent =
          Math.floor(
            (variant.data.totalBatch / product.data.totalBatch) * 100
          ) || 0;
        variant.data.quantityPercent =
          Math.floor((variant.data.quantity / product.data.quantity) * 100) ||
          0;
        variant.data.soldCakePercent =
          Math.floor((variant.data.soldCake / product.data.soldCake) * 100) ||
          0;
      }

      product.data.soldCakeToQuantityPercent =
        Math.floor((product.data.soldCake / product.data.quantity) * 100) || 0;

      // Update type data
      type.data.totalBatch += product.data.totalBatch;
      type.data.soldCake += product.data.soldCake;
      type.data.quantity += product.data.quantity;
    }
    // Calculate children percent data after parent gets needed data
    for (let j = 0; j < productTypes[i].products!.length; j++) {
      const product = type.products![j];
      if (!groupedBatches.get(type.id)!.has(product.id)) continue;

      product.data.totalBatchPercent =
        Math.floor((product.data.totalBatch / type.data.totalBatch) * 100) || 0;
      product.data.quantityPercent =
        Math.floor((product.data.quantity / type.data.quantity) * 100) || 0;
      product.data.soldCakePercent =
        Math.floor((product.data.soldCake / type.data.soldCake) * 100) || 0;
    }

    type.data.soldCakeToQuantityPercent =
      Math.floor((type.data.soldCake / type.data.quantity) * 100) || 0;

    // Update batch data
    batchTabData.totalBatch += type.data.totalBatch;
    batchTabData.quantity += type.data.quantity;
    batchTabData.soldCake += type.data.soldCake;
  }
  // Calculate children percent data after parent gets needed data
  for (let i = 0; i < productTypes.length; i++) {
    const type = batchTabData.productTypes[i];
    if (!groupedBatches.has(type.id)) continue;

    type.data.totalBatchPercent =
      Math.floor((type.data.totalBatch / batchTabData.totalBatch) * 100) || 0;
    type.data.quantityPercent =
      Math.floor((type.data.quantity / batchTabData.quantity) * 100) || 0;
    type.data.soldCakePercent =
      Math.floor((type.data.soldCake / batchTabData.soldCake) * 100) || 0;
  }

  batchTabData.soldCakePercent =
    Math.floor((batchTabData.soldCake / batchTabData.quantity) * 100) || 0;

  return batchTabData;
}
export function getDefaultBatchTabData(
  productTypes: ProductTypeTableRow[]
): BatchTabData {
  const types = productTypes.map(
    (type) =>
      ({
        id: type.id,
        name: type.name,
        image: type.image,
        data: getDefaultGeneralBatchData(),
        products: type.products?.map(
          (product) =>
            ({
              id: product.id,
              name: product.name,
              image: product.images[0],
              data: getDefaultGeneralBatchData(),
              variants: product.variants?.map(
                (variant) =>
                  ({
                    id: variant.id,
                    material: variant.material,
                    size: variant.size,
                    data: getDefaultGeneralBatchData(),
                    batches: [],
                  } as VariantBatchData)
              ),
            } as ProductBatchData)
        ),
      } as ProductTypeBatchData)
  );
  return {
    totalBatch: 0,
    quantity: 0,
    soldCake: 0,
    soldCakePercent: 0,
    productTypes: types,
  } as BatchTabData;
}
export function getDefaultGeneralBatchData() {
  const data: GeneralBatchData = {
    totalBatch: 0,
    totalBatchPercent: 0,
    quantity: 0,
    quantityPercent: 0,
    soldCake: 0,
    soldCakeToQuantityPercent: 0,
    soldCakePercent: 0,
  };
  return data;
}
export function getGroupedBatches(batches: Batch[]) {
  const groupedBatches: Map<
    string,
    Map<string, Map<string, Batch[]>>
  > = new Map();
  batches.forEach((batch) => {
    if (groupedBatches.has(batch.product_type_id)) {
      const productType = groupedBatches.get(batch.product_type_id);
      if (productType) {
        const product = productType.get(batch.product_id);
        if (product) {
          const variant = product.get(batch.variant_id);
          if (variant) {
            variant.push(batch);
          } else {
            product.set(batch.variant_id, [batch]);
          }
        } else {
          productType.set(
            batch.product_id,
            new Map([[batch.variant_id, [batch]]])
          );
        }
      }
    } else {
      groupedBatches.set(
        batch.product_type_id,
        new Map([[batch.product_id, new Map([[batch.variant_id, [batch]]])]])
      );
    }
  });
  return groupedBatches;
}
