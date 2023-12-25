import Batch from '@/models/batch';
import Bill from '@/models/bill';
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
export function getMainTabData(bills: Bill[], batches: Batch[]) {
  return {
    revenue: getMainTabRevenue(bills),
    batch: getMainTabBatch(bills, batches),
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
  bills: Bill[],
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

export function getBranchRevenueData(bills: Bill[]): { [key: string]: number } {
  return bills.reduce((result: { [key: string]: number }, bill) => {
    if (!result[bill.branch_id]) {
      result[bill.branch_id] = 0;
    }

    result[bill.branch_id] += bill.final_price;

    return result;
  }, {});
}
