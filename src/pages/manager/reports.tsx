import TimeRangeInput from '@/components/report/TimeRangeInput/TimeRangeInput';
import { getUpdatedIntervals, initIntervals } from '@/lib/pageSpecific/report';
import {
  Interval,
  IntervalType,
  ReportTab,
  TimeRange,
} from '@/lib/types/report';
import { formatPrice } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import {
  Box,
  Card,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  styled,
} from '@mui/material';
import Chart, { ChartData, ChartOptions } from 'chart.js/auto';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
Chart.register();

const IntervalNavigateIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  borderRadius: 4,
  color: 'white',
  width: 80,
  ':hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

const Report = () => {
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
  //#region Revenue + Batch zone

  const [currentTab, setCurrentTab] = useState<ReportTab>('main');

  //#endregion

  return (
    <>
      <Grid container p={2} rowSpacing={2} columnSpacing={2}>
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
            onClickRevenueTab={() => setCurrentTab('revenue')}
            onClickBatchTab={() => setCurrentTab('batch')}
          />
        )}
        {currentTab === 'revenue' && (
          <RevenueTab onClickBack={() => setCurrentTab('main')} />
        )}
        {currentTab === 'batch' && (
          <BatchTab onClickBack={() => setCurrentTab('main')} />
        )}
      </Grid>
    </>
  );
};

//#region Main Tab

type MainTabProps = {
  onClickRevenueTab: () => void;
  onClickBatchTab: () => void;
};

function MainTab({ onClickRevenueTab, onClickBatchTab }: MainTabProps) {
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
                {formatPrice(12000000)}
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="center" pr={4} pt={4}>
              <Typography typography="h5">Tiền đã khuyến mãi</Typography>
              <Typography color="error.main">
                {formatPrice(-2000000)}
              </Typography>
            </Grid>
            <Grid item xs={12} py={1}>
              <Divider />
            </Grid>
            <Grid item xs={12} textAlign={'center'} px={4} pb={4}>
              <Typography typography="h5">Doanh thu thực sự</Typography>
              <Typography color="success.main">
                {formatPrice(10000000)}
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
              <Typography>100</Typography>
            </Grid>
            <Grid item xs={12} py={1}>
              <Divider />
            </Grid>
            <Grid item xs={6} textAlign={'center'} pl={4} pb={4}>
              <Typography typography="h5">Lô bánh đã bán</Typography>
              <Typography color="success.main">80 (80%)</Typography>
            </Grid>
            <Grid item xs={6} textAlign={'center'} pr={4} pb={4}>
              <Typography typography="h5">Lô bánh hết hạn</Typography>
              <Typography color="error.main">20 (20%)</Typography>
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
  onClickBack(): void;
};

function RevenueTab({ onClickBack }: RevenueTabProps) {
  const chartData: ChartData<'pie', number[], string> = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: '% Doanh thu',
        data: [300, 50, 100],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
        ],
      },
    ],
  };

  const chartOptions: ChartOptions<'pie'> = {
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
  };

  const revenueChartData: ChartData<'line', number[], string> = {
    labels: Array.from({ length: 30 }).map((_, index) =>
      (index + 1).toString()
    ),
    datasets: [
      {
        data: Array.from({ length: 30 }).map(() =>
          Math.floor(Math.random() * 1000000)
        ),
      },
    ],
  };

  const revenueChartOptions: ChartOptions<'line'> = {
    scales: {
      x: {
        ticks: {
          callback: (value) => {
            return `Tháng ${value}`;
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
  };

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
                <ListItemText primary={formatPrice(12000000)} />
              </ListItem>
              <Divider />
            </List>
            <List sx={{ overflow: 'auto', maxHeight: 400 }}>
              {Array.from({ length: 10 }).map((_, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Chi nhánh ${index + 1}`}
                    secondary={`Địa chỉ chi nhánh ${index + 1}`}
                  />
                  <Divider orientation="vertical" />
                  <ListItemText primary={`${formatPrice(8000000)} (80%)`} />
                </ListItem>
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

//#endregion
//#region

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
