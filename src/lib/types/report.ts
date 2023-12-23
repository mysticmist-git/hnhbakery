export type TimeRange = 'interval' | 'custom';
export type IntervalType = 'day' | 'week' | 'month' | 'year';
export type Interval = {
  index: number;
  type: IntervalType;
  label: string;
  from: Date;
  to: Date;
};
export type ReportTab = 'revenue' | 'batch' | 'main';
