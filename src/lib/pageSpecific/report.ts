import dayjs from 'dayjs';
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
