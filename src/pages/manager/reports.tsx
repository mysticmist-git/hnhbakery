import BatchTab from '@/components/report/BatchTab';
import MainTab from '@/components/report/MainTab';
import RevenueTab from '@/components/report/RevenueTab';
import TimeRangeInput, {
  CustomFromTo,
  initCustomFromTo,
} from '@/components/report/TimeRangeInput/TimeRangeInput';
import { getBillTableRows } from '@/lib/DAO/billDAO';
import { getDownloadUrlFromFirebaseStorage } from '@/lib/firestore';
import useBranches from '@/lib/hooks/useBranches';
import {
  ProductRevenue,
  VariantRevenue,
  getBranchRevenueData,
  getFromDateToDateText,
  getMainTabData,
  getProductTypeRevenueData,
  getRevenueTabChartData,
  getUpdatedIntervals,
  initIntervals,
} from '@/lib/pageSpecific/report';
import {
  Interval,
  IntervalType,
  ReportTab,
  TimeRange,
} from '@/lib/types/report';
import { formatPrice } from '@/lib/utils';
import { BillTableRow } from '@/models/bill';
import Branch from '@/models/branch';
import { withHashCacheAsync } from '@/utils/withHashCache';
import {
  ChevronLeft,
  ChevronRight,
  KeyboardArrowDown,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import Chart, { ChartData, ChartOptions } from 'chart.js/auto';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
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
  soldBatch: number;
  expiredBatch: number;
};

const cachedGetAllBills = withHashCacheAsync(getBillTableRows);

async function getBillsInRange(from: Date, to: Date) {
  const bills = await cachedGetAllBills();
  const filter = bills.filter(
    (bill) =>
      dayjs(bill.created_at).isAfter(dayjs(from)) &&
      dayjs(bill.created_at).isBefore(dayjs(to))
  );
  console.log(filter);
  return filter;
}

const DEFAULT_MAIN_TAB_DATA = {
  revenue: {
    totalRevenue: 0,
    saleAmount: 0,
    finalRevenue: 0,
  },
  batch: {
    totalBatch: 0,
    soldBatch: 0,
    expiredBatch: 0,
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

  const fetchData = useCallback(async () => {
    let from: Date;
    let to: Date;
    if (timeRangeType === 'interval') {
      const currentInterval = intervals.find(
        (interval) => interval.index === currentIntervalIndex
      );
      if (!currentInterval) {
        setBillTableRows([]);
        return;
      }
      from = currentInterval.from;
      to = currentInterval.to;
    } else {
      from = customFromTo.from;
      to = customFromTo.to;
    }

    try {
      const bills = await getBillsInRange(
        dayjs(from).toDate(),
        dayjs(to).toDate()
      );
      setBillTableRows(bills);
    } catch (error) {
      console.log(error);
    }
  }, [
    currentIntervalIndex,
    customFromTo.from,
    customFromTo.to,
    intervals,
    timeRangeType,
  ]);

  useEffect(() => {
    fetchData();
  }, [currentIntervalIndex, fetchData, intervals, timeRangeType]);

  useEffect(() => {
    const mainTabData = getMainTabData(billTableRows);
    setMainTabData(mainTabData);
  }, [billTableRows, billTableRows.length]);

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
