import { ProductTypeRenderOptionProps } from '@/components/manage/modals/forms/BatchForm/ProductTypeRenderOption/ProductTypeRenderOption';
import TimeRangeInput from '@/components/report/TimeRangeInput/TimeRangeInput';
import { getBatches } from '@/lib/DAO/batchDAO';
import { getBillTableRowById, getBillTableRows } from '@/lib/DAO/billDAO';
import { getDownloadUrlFromFirebaseStorage } from '@/lib/firestore';
import useBranches from '@/lib/hooks/useBranches';
import { valueComparer } from '@/lib/pageSpecific/products';
import {
  ProductRevenue,
  ProductTypeRevenue,
  VariantRevenue,
  getBranchRevenueData,
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
import Batch from '@/models/batch';
import Bill, { BillTableRow } from '@/models/bill';
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
  ListItemAvatar,
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
  const [billTableRows, setBillTableRows] = useState<BillTableRow[]>([]);

  const fetchData = useCallback(async () => {
    const currentInterval = intervals.find(
      (interval) => interval.index === currentIntervalIndex
    );
    if (!currentInterval) {
      setBillTableRows([]);
      return;
    }

    try {
      const bills = await getBillsInRange(
        dayjs(currentInterval.from).startOf('month').toDate(),
        dayjs(currentInterval.to).endOf('month').toDate()
      );
      setBillTableRows(bills);
    } catch (error) {
      console.log(error);
    }
  }, [currentIntervalIndex, intervals]);

  useEffect(() => {
    if (billTableRows.length <= 0) return;

    const mainTabData = getMainTabData(billTableRows);
    setMainTabData(mainTabData);
  }, [billTableRows, billTableRows.length]);

  //#region Main Tab

  const [mainTabData, setMainTabData] = useState<MainTabData>(
    DEFAULT_MAIN_TAB_DATA
  );

  //#endregion

  //#endregion

  console.log(billTableRows);

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

type RevenueTabProps = {
  interval: Interval;
  billTableRows: BillTableRow[];
  onClickBack(): void;
};

function RevenueTab({ interval, billTableRows, onClickBack }: RevenueTabProps) {
  const branches = useBranches();

  const data: number[] = useMemo(() => {
    return billTableRows.length > 0
      ? getRevenueTabChartData(billTableRows, interval)
      : [];
  }, [billTableRows, interval]);
  const branchData = useMemo(() => {
    return billTableRows.length > 0 ? getBranchRevenueData(billTableRows) : {};
  }, [billTableRows]);
  const productTypeRevenueData = useMemo(() => {
    return billTableRows.length > 0
      ? getProductTypeRevenueData(billTableRows)
      : {};
  }, [billTableRows]);

  const revenueChartData: ChartData<'line', number[], string> = useMemo(
    () => ({
      labels: resolveRevenueChartLabels(interval.type, data),
      datasets: [
        {
          data: data,
        },
      ],
    }),
    [data, interval]
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
  const branchChartData: ChartData<'pie', number[], string> = useMemo(() => {
    const entries = Object.entries(branchData);
    return {
      labels: entries.map(
        (e) => branches.find((b) => b.id === e[0])?.name ?? 'Không xác định'
      ),
      datasets: [
        {
          label: '% Doanh thu',
          data: entries.map((entry) => entry[1].percent),
          backgroundColor: entries.map(
            () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
          ),
        },
      ],
    };
  }, [branchData, branches]);
  const productTypeChartData: ChartData<'pie', number[], string> =
    useMemo(() => {
      const entries = Object.entries(productTypeRevenueData);
      return {
        labels: entries.map((entry) => entry[1].name),
        datasets: [
          {
            label: '% Doanh thu',
            data: entries.map((entry) => entry[1].percent),
            backgroundColor: entries.map(
              () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
            ),
          },
        ],
      };
    }, [productTypeRevenueData]);
  const branchChartOptions: ChartOptions<'pie'> = useMemo(
    () => ({
      plugins: {
        title: {
          display: true,
          text: 'Tỉ lệ Doanh thu chi nhánh',
          font: {
            size: 20,
          },
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
  const productTypeChartOptions: ChartOptions<'pie'> = useMemo(
    () => ({
      plugins: {
        title: {
          display: true,
          text: 'Tỉ lệ Doanh thu sản phẩm',
          font: {
            size: 20,
          },
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
      {/* Theo chi nhánh */}
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
                    Object.entries(branchData).reduce(
                      (acc, key) => acc + key[1].revenue,
                      0
                    )
                  )}
                />
              </ListItem>
              <Divider />
            </List>
            <List sx={{ overflow: 'auto', maxHeight: 400 }}>
              {Object.entries(branchData).map((entry, index) => (
                <BranchRevenueItem
                  key={index}
                  branch={branches.find((b) => b.id === entry[0])}
                  data={entry[1]}
                />
              ))}
            </List>
          </Box>
        </Card>
      </Grid>
      <Grid item xs={5} sx={{ borderRadius: 4 }}>
        <Card sx={{ borderRadius: 4, height: '100%', p: 4 }}>
          <Pie data={branchChartData} options={branchChartOptions} />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      {/* Theo sản phẩm */}
      <Grid item xs={7}>
        <Card sx={{ borderRadius: 4 }}>
          <Box p={2}>
            <Typography typography="h6">Doanh thu theo sản phẩm</Typography>
          </Box>
          <Divider />
          <Box>
            <List>
              <ListItem>
                <ListItemText primary="Tổng doanh thu" />
                <ListItemText
                  primary={formatPrice(
                    Object.values(branchData).reduce(
                      (acc, value) => acc + value.revenue,
                      0
                    )
                  )}
                />
              </ListItem>
              <Divider />
            </List>
            <List sx={{ overflowY: 'auto', maxHeight: 800 }}>
              {Object.entries(productTypeRevenueData).map((entry, index) => (
                <ProductTypeRevenueItem
                  key={index}
                  name={entry[1].name}
                  image={entry[1].image}
                  revenue={entry[1].revenue}
                  percent={entry[1].percent}
                  products={entry[1].products}
                />
              ))}
            </List>
          </Box>
        </Card>
      </Grid>
      <Grid item xs={5} sx={{ borderRadius: 4 }}>
        <Card sx={{ borderRadius: 4, height: 560, p: 4 }}>
          <Pie data={productTypeChartData} options={productTypeChartOptions} />
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
  data: { revenue: number; percent: number };
}) {
  return branch ? (
    <ListItem>
      <ListItemText
        primary={`Chi nhánh ${branch.name}`}
        secondary={`Địa chỉ chi nhánh ${branch.address}`}
      />
      <Divider orientation="vertical" />
      <ListItemText
        primary={`${formatPrice(data.revenue)} (${data.percent}%)`}
      />
    </ListItem>
  ) : (
    <p>null branch</p>
  );
}

function ProductTypeRevenueItem({
  name,
  image,
  revenue,
  percent,
  products,
}: {
  name: string;
  image: string;
  revenue: number;
  percent: number;
  products: ProductRevenue;
}) {
  const [img, setImg] = useState('');
  useEffect(() => {
    getDownloadUrlFromFirebaseStorage(image).then((url) => setImg(url));
  }, [image]);

  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(
    (value?: boolean) => {
      value ? setOpen(value) : setOpen(!open);
    },
    [open]
  );

  return (
    <>
      <ListItemButton onClick={() => toggleOpen()}>
        <Box
          component="img"
          src={img}
          width={100}
          height={100}
          borderRadius={4}
          sx={{
            objectFit: 'cover',
            mr: 4,
          }}
        />
        <ListItemText primary={name} />
        <ListItemText
          primary={formatPrice(revenue)}
          secondary={`${percent}%`}
        />
        {/* toggle icon */}
        <KeyboardArrowDown
          sx={{
            mr: 2,
            transform: open ? 'rotate(-180deg)' : 'rotate(0)',
            transition: '0.2s',
          }}
        />
      </ListItemButton>
      {open &&
        Object.entries(products).map((entry, index) => (
          <ProductRevenueItem key={index} {...entry[1]} />
        ))}
    </>
  );
}

function ProductRevenueItem({
  name,
  image,
  revenue,
  percent,
  variants,
}: {
  name: string;
  image: string;
  revenue: number;
  percent: number;
  variants: VariantRevenue;
}) {
  const [img, setImg] = useState('');
  useEffect(() => {
    getDownloadUrlFromFirebaseStorage(image).then((url) => setImg(url));
  }, [image]);

  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(
    (value?: boolean) => {
      value ? setOpen(value) : setOpen(!open);
    },
    [open]
  );

  return (
    <>
      <ListItemButton onClick={() => toggleOpen()}>
        <Box
          component="img"
          src={img}
          width={100}
          height={100}
          borderRadius={4}
          sx={{
            objectFit: 'cover',
            mr: 4,
            ml: 4,
          }}
        />
        <ListItemText primary={name} />
        <ListItemText
          primary={formatPrice(revenue)}
          secondary={`${percent}%`}
        />
        {/* toggle icon */}
        <KeyboardArrowDown
          sx={{
            mr: 2,
            transform: open ? 'rotate(-180deg)' : 'rotate(0)',
            transition: '0.2s',
          }}
        />
      </ListItemButton>
      {open &&
        Object.values(variants).map((value, index) => (
          <ListItem key={index} sx={{ ml: 8 }}>
            <ListItemText primary={value.material} secondary={value.size} />
            <ListItemText
              primary={formatPrice(value.revenue)}
              secondary={`${value.percent}%`}
            />
          </ListItem>
        ))}
    </>
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
