export type TimeRange = 'interval' | 'custom';
export type IntervalType = 'week' | 'month' | 'year';
export type Interval = {
  index: number;
  type: IntervalType;
  label: string;
  from: Date;
  to: Date;
};
export type ReportTab = 'revenue' | 'batchCreated' | 'batchSold' | 'main';
