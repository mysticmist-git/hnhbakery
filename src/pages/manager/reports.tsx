/* eslint-disable react-hooks/exhaustive-deps */
import BatchSoldTab from '@/components/report/BatchSoldTab';
import BatchTab from '@/components/report/BatchTab';
import MainTab from '@/components/report/MainTab';
import RevenueTab from '@/components/report/RevenueTab';
import TimeRangeInput, {
  CustomFromTo,
  initCustomFromTo,
} from '@/components/report/TimeRangeInput/TimeRangeInput';
import { getBatches } from '@/lib/DAO/batchDAO';
import { getBillTableRows } from '@/lib/DAO/billDAO';
import useProductTypeTableRows from '@/lib/hooks/useProductTypeTableRows';
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
import { ProductTableRow } from '@/models/product';
import { Divider, Grid } from '@mui/material';
import Chart from 'chart.js/auto';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
Chart.register();

//#region Top part

export type MainTabData = {
  revenue: MainTabRevenue;
  batch: MainTabBatch;
  batchSold: MainTabBatch;
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

export type SanPhamDoanhThuType = Batch & {
  revenue: number;
  percentage: number;
  product: ProductTableRow;
};

// TODO: Remove this - This is just a temporary solution
function tempLocalCache<TResult>(fn: () => Promise<TResult>) {
  let cache: TResult;

  return async () => {
    if (!cache) {
      cache = await fn();
    }
    return cache;
  };
}

// FIX: This doesn't seem to work with no args functions
const cachedGetBillTableRows = tempLocalCache(getBillTableRows);
const cachedGetBatches = tempLocalCache(getBatches);

async function getBillsInRange(from: Date, to: Date) {
  const bills = await cachedGetBillTableRows();
  const filter = bills.filter(
    (bill) =>
      dayjs(bill.created_at).isAfter(dayjs(from)) &&
      dayjs(bill.created_at).isBefore(dayjs(to)) &&
      bill.state === 'paid'
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
  batchSold: {
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
  const [batchesSold, setBatchesSold] = useState<Batch[]>([]);

  const types = useProductTypeTableRows();
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

      console.log(batches);

      const batchesSold: Batch[] = bills
        .map(
          (bill) =>
            bill.billItems
              ?.map((billItem) => billItem.batch)
              .filter((batch) => batch) || []
        )
        .flat()
        .filter((batch) => batch) as Batch[];

      console.log(batchesSold);

      setBillTableRows(bills);
      setBatches(batches);
      setBatchesSold(batchesSold);
    } catch (error) {
      console.log(error);
    }
  }, [resolveTimeRange]);

  useEffect(() => {
    fetchData();
  }, [currentIntervalIndex, fetchData, intervals, timeRangeType]);

  useEffect(() => {
    const mainTabData = getMainTabData(billTableRows, batches, batchesSold);
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
      <Grid
        container
        p={2}
        rowSpacing={2}
        columnSpacing={2}
        justifyContent={'center'}
      >
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
            onClickBatchTab={() => setCurrentTab('batchCreated')}
            onClickBatchSoldTab={() => setCurrentTab('batchSold')}
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
            customFromTo={customFromTo}
            timeRangeType={timeRangeType}
          />
        )}

        {currentTab == 'batchSold' && (
          <BatchSoldTab
            types={types}
            batches={batchesSold}
            onClickBack={() => setCurrentTab('main')}
          />
        )}

        {currentTab === 'batchCreated' && (
          <BatchTab
            types={types}
            batches={batches}
            onClickBack={() => setCurrentTab('main')}
          />
        )}
      </Grid>
    </>
  );
}

export default Report;
