import BatchTab from '@/components/report/BatchTab';
import MainTab from '@/components/report/MainTab';
import RevenueTab from '@/components/report/RevenueTab';
import TimeRangeInput, {
  CustomFromTo,
  initCustomFromTo,
} from '@/components/report/TimeRangeInput/TimeRangeInput';
import { getBatches } from '@/lib/DAO/batchDAO';
import { getBillTableRows } from '@/lib/DAO/billDAO';
import { getProductTypeTableRows } from '@/lib/DAO/productTypeDAO';
import {
  getFromDateToDateText,
  getMainTabData,
  getUpdatedIntervals,
  initIntervals,
} from '@/lib/pageSpecific/report';
import {
  Interval,
  IntervalType,
  ReportTab,
  TimeRange,
} from '@/lib/types/report';
import Batch from '@/models/batch';
import { BillTableRow } from '@/models/bill';
import { ProductTypeTableRow } from '@/models/productType';
import { withHashCacheAsync } from '@/utils/withHashCache';
import { Divider, Grid } from '@mui/material';
import Chart from 'chart.js/auto';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
Chart.register();

//#region Top part

export type MainTabData = {
  revenue: MainTabRevenue;
  batch: MainTabBatch;
};

export type MainTabRevenue = {
  totalRevenue: number;
  saleAmount: number;
  finalRevenue: number;
};

export type MainTabBatch = {
  totalBatch: number;
  quantity: number;
  soldCake: number;
  soldCakePercent: number;
};

const cachedGetBillTableRows = withHashCacheAsync(getBillTableRows);
const cachedGetBatches = withHashCacheAsync(getBatches);

async function getBillsInRange(from: Date, to: Date) {
  const bills = await cachedGetBillTableRows();
  const filter = bills.filter(
    (bill) =>
      dayjs(bill.created_at).isAfter(dayjs(from)) &&
      dayjs(bill.created_at).isBefore(dayjs(to))
  );
  return filter;
}
async function getBatchesInRange(from: Date, to: Date) {
  const [dayjsFrom, dayjsTo] = [dayjs(from), dayjs(to)];
  const batches = await cachedGetBatches();
  return batches.filter(
    (batch) =>
      dayjs(batch.created_at).isAfter(dayjsFrom) &&
      dayjs(batch.created_at).isBefore(dayjsTo)
  );
}

const DEFAULT_MAIN_TAB_DATA: MainTabData = {
  revenue: {
    totalRevenue: 0,
    saleAmount: 0,
    finalRevenue: 0,
  },
  batch: {
    totalBatch: 0,
    quantity: 0,
    soldCake: 0,
    soldCakePercent: 0,
  },
};

//#endregion

function Report() {
  //#region Time range zone
  const [timeRangeType, setTimeRangeType] = useState<TimeRange>('interval');
  const [currentIntervalType, setCurrentIntervalType] =
    useState<IntervalType>('month');
  const [currentIntervalIndex, setCurrentIntervalIndex] = useState<number>(0); // 0 mean today | this week | this month | this year
  const [intervals, setIntervals] = useState<Interval[]>([]);

  const [customFromTo, setCustomFromTo] = useState<CustomFromTo>(
    initCustomFromTo()
  );
  const handleCustomFromToChange = useCallback((value: CustomFromTo) => {
    setCustomFromTo(value);
  }, []);

  const fromDateToDateText = useMemo(() => {
    const currentInterval = intervals.find(
      (interval) => interval.index === currentIntervalIndex
    );

    if (!currentInterval) {
      return 'Đang tải khoảng thời gian...';
    }

    return getFromDateToDateText(currentInterval.from, currentInterval.to);
  }, [currentIntervalIndex, intervals]);

  useEffect(() => {
    // Init it if it's empty or the interval type is changed
    if (intervals.length <= 0 || currentIntervalType !== intervals[0].type) {
      setIntervals(initIntervals(currentIntervalType));
      return;
    }

    const [change, updatedIntervals] = getUpdatedIntervals(
      currentIntervalType,
      intervals,
      currentIntervalIndex
    );

    if (change) setIntervals(updatedIntervals);
  }, [currentIntervalIndex, currentIntervalType, intervals]);

  //#endregion
  //#region Tabs zone

  const [currentTab, setCurrentTab] = useState<ReportTab>('main');
  const [billTableRows, setBillTableRows] = useState<BillTableRow[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  const resolveTimeRange = useCallback((): [Date, Date] => {
    let from: Date;
    let to: Date;
    if (timeRangeType === 'interval') {
      const currentInterval = intervals.find(
        (interval) => interval.index === currentIntervalIndex
      );
      if (!currentInterval) {
        setBillTableRows([]);
        throw new Error('Invalid interval');
      }
      from = currentInterval.from;
      to = currentInterval.to;
    } else {
      from = customFromTo.from;
      to = customFromTo.to;
    }

    return [from, to];
  }, [
    currentIntervalIndex,
    customFromTo.from,
    customFromTo.to,
    intervals,
    timeRangeType,
  ]);

  const fetchData = useCallback(async () => {
    let from: Date;
    let to: Date;
    try {
      [from, to] = resolveTimeRange();
    } catch {
      return;
    }
    try {
      const bills = await getBillsInRange(
        dayjs(from).toDate(),
        dayjs(to).toDate()
      );
      const batches = await getBatchesInRange(
        dayjs(from).toDate(),
        dayjs(to).toDate()
      );
      setBillTableRows(bills);
      setBatches(batches);
    } catch (error) {
      console.log(error);
    }
  }, [resolveTimeRange]);

  useEffect(() => {
    fetchData();
  }, [currentIntervalIndex, fetchData, intervals, timeRangeType]);

  useEffect(() => {
    const mainTabData = getMainTabData(billTableRows, batches);
    setMainTabData(mainTabData);
  }, [batches, billTableRows, billTableRows.length]);

  //#region Main Tab

  const [mainTabData, setMainTabData] = useState<MainTabData>(
    DEFAULT_MAIN_TAB_DATA
  );

  //#endregion

  //#endregion

  return (
    <>
      <Grid container p={2} rowSpacing={2} columnSpacing={2}>
        <Grid item xs={12} height={200}>
          <TimeRangeInput
            timeRangeType={timeRangeType}
            handleTimeRangeTypeChange={function (value: TimeRange): void {
              setTimeRangeType(value);
            }}
            currentIntervalType={currentIntervalType}
            handleIntervalTypeChange={function (value: IntervalType): void {
              setCurrentIntervalIndex(0);
              setCurrentIntervalType(value);
            }}
            currentIntervalIndex={currentIntervalIndex}
            handleCurrentIntervalIndexChange={function (value: number): void {
              setCurrentIntervalIndex(value);
            }}
            intervals={intervals}
            fromDateToDateText={fromDateToDateText}
            customFrom={customFromTo.from}
            customTo={customFromTo.to}
            handleCustomFromToChange={handleCustomFromToChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        {currentTab === 'main' && (
          <MainTab
            data={mainTabData}
            onClickRevenueTab={() => setCurrentTab('revenue')}
            onClickBatchTab={() => setCurrentTab('batch')}
          />
        )}
        {currentTab === 'revenue' && (
          <RevenueTab
            interval={
              intervals.find(
                (interval) => interval.index === currentIntervalIndex
              )!
            }
            billTableRows={billTableRows}
            onClickBack={() => setCurrentTab('main')}
          />
        )}
        {currentTab === 'batch' && (
          <BatchTab onClickBack={() => setCurrentTab('main')} />
        )}
      </Grid>
    </>
  );
}

export default Report;
