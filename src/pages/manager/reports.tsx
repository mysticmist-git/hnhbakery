import TimeRangeInput from '@/components/report/TimeRangeInput/TimeRangeInput';
import { getBatches } from '@/lib/DAO/batchDAO';
import { getBillsForReportPage } from '@/lib/DAO/billDAO';
import useBranches from '@/lib/hooks/useBranches';
import {
  getBranchRevenueData,
  getMainTabData,
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
import Batch from '@/models/batch';
import Bill from '@/models/bill';
import Branch from '@/models/branch';
import { withHashCacheAsync } from '@/utils/withHashCache';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
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

const cachedGetAllBills = withHashCacheAsync(getBillsForReportPage);
const cachedGetBatches = withHashCacheAsync(getBatches);

async function getBillsInRange(from: Date, to: Date) {
  const bills = await cachedGetAllBills();
  return bills.filter(
    (bill) => bill.created_at >= from && bill.created_at <= to
  );
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

  const fromDateToDateText = useMemo(() => {
    const currentInterval = intervals.find(
      (interval) => interval.index === currentIntervalIndex
    );

    if (!currentInterval) {
      return 'Đang tải khoảng thời gian...';
    }

    return ` Từ ${dayjs(currentInterval.from).format('DD/MM/YYYY')} - Tới
            ${dayjs(currentInterval.to).format('DD/MM/YYYY')}`;
  }, [currentIntervalIndex, intervals]);

  useEffect(() => {
    // Init it if it's empty
    if (intervals.length <= 0) {
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

  const [bills, setBills] = useState<Bill[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);

  const fetchData = useCallback(async () => {
    const currentInterval = intervals.find(
      (interval) => interval.index === currentIntervalIndex
    );
    if (!currentInterval) {
      setBills([]);
      return;
    }

    try {
      const bills = await getBillsInRange(
        dayjs(currentInterval.from).startOf('month').toDate(),
        dayjs(currentInterval.to).endOf('month').toDate()
      );

      let batches = await cachedGetBatches();
      const batchIds = bills.flatMap((bill) =>
        bill.bill_items?.map((item) => item.batch_id)
      );
      batches = batches.filter((batch) => batchIds.includes(batch.id));

      setBills(bills);
      setBatches(batches);
    } catch (error) {
      console.log(error);
    }
  }, [currentIntervalIndex, intervals]);

  useEffect(() => {
    if (bills.length <= 0 || batches.length <= 0) return;

    const mainTabData = getMainTabData(bills, batches);
    setMainTabData(mainTabData);
  }, [batches, bills]);

  //#region Main Tab

  const [mainTabData, setMainTabData] = useState<MainTabData>(
    DEFAULT_MAIN_TAB_DATA
  );

  //#endregion
  //#region Revenue Tab

  const [revenueTabChartData, setRevenueTabChartData] = useState<number[]>([]);
  const [branchRevenueData, setBranchRevenueData] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    const currentInterval = intervals.find(
      (interval) => interval.index === currentIntervalIndex
    );
    if (!currentInterval || bills.length <= 0) {
      console.log('run');
      setRevenueTabChartData([]);
      return;
    }
    const chartData = getRevenueTabChartData(bills, currentInterval);
    const branchRevenueData = getBranchRevenueData(bills);

    setRevenueTabChartData(chartData);
    setBranchRevenueData(branchRevenueData);
  }, [bills, currentIntervalIndex, intervals]);

  //#endregion

  //#endregion

  console.log(bills);
  console.log(batches);

  return (
    <>
      <Grid container p={2} rowSpacing={2} columnSpacing={2}>
        <Grid>
          <Button variant="contained" onClick={fetchData}>
            DEBUG
          </Button>
        </Grid>
        <Grid item xs={12}>
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
            revenueChartData={revenueTabChartData}
            branchRevenueData={branchRevenueData}
            intervalType={currentIntervalType}
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

//#region Main Tab

type MainTabProps = {
  data: MainTabData;
  onClickRevenueTab: () => void;
  onClickBatchTab: () => void;
};

function MainTab({ data, onClickRevenueTab, onClickBatchTab }: MainTabProps) {
  return (
    <>
      <Grid item xs={6}>
        <Card
          elevation={4}
          sx={{
            borderRadius: 4,
            display: 'flex',
          }}
        >
          <Grid container>
            <Grid item xs={6} textAlign={'center'} pl={4} pt={4}>
              <Typography typography="h5">Tổng doanh thu</Typography>
              <Typography color="success.main">
                {formatPrice(data.revenue.totalRevenue)}
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="center" pr={4} pt={4}>
              <Typography typography="h5">Tiền đã khuyến mãi</Typography>
              <Typography color="error.main">
                {formatPrice(-data.revenue.saleAmount)}
              </Typography>
            </Grid>
            <Grid item xs={12} py={1}>
              <Divider />
            </Grid>
            <Grid item xs={12} textAlign={'center'} px={4} pb={4}>
              <Typography typography="h5">Doanh thu thực sự</Typography>
              <Typography color="success.main">
                {formatPrice(data.revenue.finalRevenue)}
              </Typography>
            </Grid>
          </Grid>
          <Divider orientation="vertical" flexItem />
          <IconButton sx={{ borderRadius: 0 }} onClick={onClickRevenueTab}>
            <ChevronRight />
          </IconButton>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card
          elevation={4}
          sx={{
            borderRadius: 4,
            display: 'flex',
          }}
        >
          <Grid container>
            <Grid item xs={12} textAlign="center" px={4} pt={4}>
              <Typography typography="h5">Lô bánh làm ra</Typography>
              <Typography>{data.batch.totalBatch}</Typography>
            </Grid>
            <Grid item xs={12} py={1}>
              <Divider />
            </Grid>
            <Grid item xs={6} textAlign={'center'} pl={4} pb={4}>
              <Typography typography="h5">Lô bánh đã bán</Typography>
              <Typography color="success.main">
                {data.batch.soldBatch}
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign={'center'} pr={4} pb={4}>
              <Typography typography="h5">Lô bánh hết hạn</Typography>
              <Typography color="error.main">
                {data.batch.expiredBatch}
              </Typography>
            </Grid>
          </Grid>
          <Divider orientation="vertical" flexItem />
          <IconButton sx={{ borderRadius: 0 }} onClick={onClickBatchTab}>
            <ChevronRight />
          </IconButton>
        </Card>
      </Grid>
    </>
  );
}

//#endregion
//#region Revenue Tab

type RevenueTabProps = {
  intervalType: IntervalType;
  revenueChartData: number[];
  branchRevenueData: { [key: string]: number };
  onClickBack(): void;
};

function resolveRevenueChartLabels(
  intervalType: IntervalType,
  data: number[]
): string[] {
  switch (intervalType) {
    case 'month':
      return data.map((_, index) => `Ngày ${index + 1}`);
    case 'year':
      return data.map((_, index) => `Tháng ${index + 1}`);
    default:
      return [];
  }
}

function RevenueTab({
  intervalType,
  revenueChartData: data,
  branchRevenueData,
  onClickBack,
}: RevenueTabProps) {
  //#region Branch data

  const branches = useBranches();

  //#endregion

  const revenueChartData: ChartData<'line', number[], string> = useMemo(
    () => ({
      labels: resolveRevenueChartLabels(intervalType, data),
      datasets: [
        {
          data: data,
        },
      ],
    }),
    [data, intervalType]
  );
  const revenueChartOptions: ChartOptions<'line'> = useMemo(
    () => ({
      scales: {
        x: {
          ticks: {
            callback: (value) => {
              return `Ngày ${value}`;
            },
          },
        },
        y: {
          ticks: {
            callback: (value) => {
              return `${value} VNĐ`;
            },
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Biểu đồ đường Doanh thu tháng',
          font: {
            size: 20,
          },
        },
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return `${context.parsed.y} VNĐ`;
            },
          },
        },
      },
    }),
    []
  );
  const chartData: ChartData<'pie', number[], string> = useMemo(() => {
    const keys = Object.keys(branchRevenueData);
    const totalRevenue = keys.reduce((acc, key) => {
      return acc + branchRevenueData[key];
    }, 0);

    const data: number[] = [];
    let accumulate = 0;
    for (let i = 0; i < keys.length - 1; i++) {
      const percent = Math.floor(
        (branchRevenueData[keys[i]] * 100) / totalRevenue
      );
      accumulate += percent;
      data.push(percent);
    }
    data.push(100 - accumulate);

    return {
      labels: keys.map(
        (key) => branches.find((b) => b.id === key)?.name ?? 'Không tìm được'
      ),
      datasets: [
        {
          label: '% Doanh thu',
          data: data,
          backgroundColor: keys.map(
            () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
          ),
        },
      ],
    };
  }, [branchRevenueData, branches]);
  const chartOptions: ChartOptions<'pie'> = useMemo(
    () => ({
      plugins: {
        title: {
          display: true,
          text: 'Tỉ lệ Doanh thu chi nhánh',
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return `${context.parsed}%`;
            },
          },
        },
      },
    }),
    []
  );

  return (
    <>
      <Grid item xs={12} display={'flex'} alignItems={'center'} gap={1}>
        <IconButton
          sx={{
            borderRadius: 2,
            color: 'white',
            backgroundColor: 'secondary.main',
            ':hover': {
              backgroundColor: 'secondary.dark',
            },
          }}
          onClick={onClickBack}
        >
          <ChevronLeft />
        </IconButton>
        <Divider orientation="vertical" flexItem />
        <Typography
          typography="h6"
          sx={{
            cursor: 'default',
            transition: '0.2s ease-in-out',
            ':hover': {
              transform: 'scale(1.1)',
              color: 'secondary.main',
              translate: '10%',
            },
          }}
        >
          Doanh thu
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 4, p: 2 }}>
          <Line data={revenueChartData} options={revenueChartOptions} />
        </Card>
      </Grid>
      <Grid item xs={7}>
        <Card sx={{ borderRadius: 4 }}>
          <Box p={2}>
            <Typography typography="h6">Doanh thu theo chi nhánh</Typography>
          </Box>
          <Divider />
          <Box>
            <List>
              <ListItem>
                <ListItemText primary="Tổng doanh thu" />
                <ListItemText
                  primary={formatPrice(
                    Object.keys(branchRevenueData).reduce(
                      (acc, key) => acc + branchRevenueData[key],
                      0
                    )
                  )}
                />
              </ListItem>
              <Divider />
            </List>
            <List sx={{ overflow: 'auto', maxHeight: 400 }}>
              {Object.keys(branchRevenueData).map((key, index) => (
                <BranchRevenueItem
                  key={index}
                  branch={branches.find((b) => b.id === key)}
                  data={branchRevenueData[key]}
                />
              ))}
            </List>
          </Box>
        </Card>
      </Grid>
      <Grid item xs={5} sx={{ borderRadius: 4 }}>
        <Card sx={{ borderRadius: 4, height: '100%', p: 4 }}>
          <Pie data={chartData} options={chartOptions} />
        </Card>
      </Grid>
    </>
  );
}

function BranchRevenueItem({
  branch,
  data,
}: {
  branch?: Branch;
  data: number;
}) {
  return branch ? (
    <ListItem>
      <ListItemText
        primary={`Chi nhánh ${branch.name}`}
        secondary={`Địa chỉ chi nhánh ${branch.address}`}
      />
      <Divider orientation="vertical" />
      <ListItemText primary={`${formatPrice(data)} (${data}%)`} />
    </ListItem>
  ) : (
    <p>null branch</p>
  );
}

//#endregion
//#region Batch tab

type BatchTabProps = {
  onClickBack(): void;
};

function BatchTab({ onClickBack }: BatchTabProps) {
  return (
    <>
      <Grid item xs={12} display={'flex'} alignItems={'center'} gap={1}>
        <IconButton
          sx={{
            borderRadius: 2,
            color: 'white',
            backgroundColor: 'secondary.main',
            ':hover': {
              backgroundColor: 'secondary.dark',
            },
          }}
          onClick={onClickBack}
        >
          <ChevronLeft />
        </IconButton>
        <Divider orientation="vertical" flexItem />
        <Typography
          typography="h6"
          sx={{
            cursor: 'default',
            transition: '0.2s ease-in-out',
            ':hover': {
              transform: 'scale(1.1)',
              color: 'secondary.main',
              translate: '10%',
            },
          }}
        >
          Lô hàng
        </Typography>
      </Grid>
    </>
  );
}

//#endregion

export default Report;
