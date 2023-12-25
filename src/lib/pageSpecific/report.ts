import Batch from '@/models/batch';
import Bill, { BillTableRow } from '@/models/bill';
import { MainTabBatch } from '@/pages/manager/reports';
import dayjs from 'dayjs';
import { isTemplateExpression } from 'typescript';
import { Interval, IntervalType } from '../types/report';

const REPORT_CONSTANT = {
  EACH_INTERVAL_RANGE: 5,
};

export function resolveIntervalLabel(
  index: number,
  type: IntervalType
): string {
  switch (type) {
    case 'day':
      return resolveDayIntervalLabel(index);
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

export function resolveDayIntervalLabel(index: number): string {
  return `Day ${index}`;
}
export function resolveWeekIntervalLabel(index: number): string {
  return `Week ${index}`;
}
export function resolveMonthIntervalLabel(index: number): string {
  if (index === 0) return 'Tháng này';
  if (index === -1) return 'Tháng trước';
  if (index === 1) return 'Tháng sau';

  return dayjs().add(index, 'month').format('MM/YYYY');
}
export function resolveYearIntervalLabel(index: number): string {
  return `Year ${index}`;
}
export function initIntervals(intervalType: IntervalType): Interval[] {
  const initializedIntervals: Interval[] = [];
  switch (intervalType) {
    case 'day':
      break;
    case 'week':
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
    switch (intervalType) {
      case 'day':
        updatedIntervals = [];
        break;
      case 'week':
        updatedIntervals = [];
      case 'month':
        updatedIntervals = getUpdatedLeftMonthIntervals(intervals);
        break;
      case 'year':
        updatedIntervals = [];
        break;
    }
    change = true;
  } else if (intervalIndex >= intervals[intervals.length - 1].index) {
    switch (intervalType) {
      case 'day':
        updatedIntervals = [];
      case 'week':
        updatedIntervals = [];
      case 'month':
        updatedIntervals = getUpdatedRightMonthIntervals(intervals);
        break;
      case 'year':
        updatedIntervals = [];
        break;
    }
    change = true;
  }

  return [change, updatedIntervals];
}

export function getUpdatedLeftMonthIntervals(intervals: Interval[]) {
  const cloneToUpdateIntervals = [...intervals];

  for (
    let i = intervals[0].index - 1;
    i >= intervals[0].index - REPORT_CONSTANT.EACH_INTERVAL_RANGE;
    i--
  ) {
    cloneToUpdateIntervals.unshift({
      index: i,
      type: 'month',
      label: resolveIntervalLabel(i, 'month'),
      from: dayjs().add(i, 'month').startOf('month').toDate(),
      to: dayjs().add(i, 'month').endOf('month').toDate(),
    });
  }

  return cloneToUpdateIntervals;
}

export function getUpdatedRightMonthIntervals(intervals: Interval[]) {
  const cloneToUpdateIntervals = [...intervals];

  for (
    let i = intervals[intervals.length - 1].index + 1;
    i <=
    intervals[intervals.length - 1].index + REPORT_CONSTANT.EACH_INTERVAL_RANGE;
    i++
  ) {
    cloneToUpdateIntervals.push({
      index: i,
      type: 'month',
      label: resolveIntervalLabel(i, 'month'),
      from: dayjs().add(i, 'month').startOf('month').toDate(),
      to: dayjs().add(i, 'month').endOf('month').toDate(),
    });
  }

  return cloneToUpdateIntervals;
}
export function getMainTabData(bills: Bill[]) {
  return {
    revenue: getMainTabRevenue(bills),
    // TODO: todo
    batch: {
      soldBatch: 0,
      expiredBatch: 0,
      totalBatch: 0,
    },
  };
}

export function getMainTabRevenue(bills: Bill[]) {
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

export function getMainTabBatch(bills: Bill[], batches: Batch[]): MainTabBatch {
  const totalBatch = batches.length;

  return {
    soldBatch: 0,
    expiredBatch: 0,
    totalBatch: totalBatch,
  };
}

export function getRevenueTabChartData(
  bills: BillTableRow[],
  interval: Interval
): number[] {
  switch (interval.type) {
    case 'month':
      const numberOfDays = dayjs(interval.to).diff(dayjs(interval.from), 'day');
      const revenues = new Array(numberOfDays + 1).fill(0);

      for (let i = 0; i < numberOfDays; i++) {
        const date = dayjs(interval.from).add(i, 'day');
        revenues[i] = bills.reduce((acc, cur) => {
          if (dayjs(cur.created_at).isSame(date, 'day')) {
            return acc + cur.total_price;
          }
          return acc;
        }, 0);
      }
      return revenues;
    case 'year':
      return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    default:
      return [0];
  }
}

type BranchRevenue = {
  [key: string]: {
    revenue: number;
    percent: number;
  };
};

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

type RevenueAndPercent = {
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
