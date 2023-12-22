import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  styled,
} from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

const IntervalNavigateIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  borderRadius: 4,
  color: 'white',
  width: 80,
  ':hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

type TimeRange = 'interval' | 'custom';
type IntervalType = 'day' | 'week' | 'month' | 'year';
type Interval = {
  index: number;
  type: IntervalType;
  label: string;
  from: Date;
  to: Date;
};

function resolveIntervalLabel(index: number, type: IntervalType): string {
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

function resolveDayIntervalLabel(index: number): string {
  return `Day ${index}`;
}
function resolveWeekIntervalLabel(index: number): string {
  return `Week ${index}`;
}
function resolveMonthIntervalLabel(index: number): string {
  if (index === 0) return 'Tháng này';
  if (index === -1) return 'Tháng trước';
  if (index === 1) return 'Tháng sau';

  return dayjs().add(index, 'month').format('MM/YYYY');
}
function resolveYearIntervalLabel(index: number): string {
  return `Year ${index}`;
}

const REPORT_CONSTANT = {
  EACH_INTERVAL_RANGE: 5,
};

function initIntervals(intervalType: IntervalType): Interval[] {
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

function getUpdatedIntervals(
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

function getUpdatedLeftMonthIntervals(intervals: Interval[]) {
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

function getUpdatedRightMonthIntervals(intervals: Interval[]) {
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

const Report = () => {
  const [timeRangeType, setTimeRangeType] = useState<TimeRange>('interval');
  const [currentIntervalType, setCurrentIntervalType] =
    useState<IntervalType>('month');
  const [currentIntervalIndex, setCurrentIntervalIndex] = useState<number>(0); // 0 mean today | this week | this month | this year
  const [intervals, setIntervals] = useState<Interval[]>([]);

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

  console.log(intervals);

  return (
    <>
      <Grid container my={2}>
        <Grid item xs={12} display="flex" justifyContent={'center'}>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button
              color={timeRangeType === 'interval' ? 'secondary' : 'primary'}
              onClick={() => setTimeRangeType('interval')}
            >
              Khoảng thời gian
            </Button>
            <Button
              color={timeRangeType === 'custom' ? 'secondary' : 'primary'}
              onClick={() => setTimeRangeType('custom')}
            >
              Tùy chỉnh
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="center"
          mt={2}
          gap={1}
        >
          {timeRangeType === 'interval' && (
            <>
              <IntervalNavigateIconButton
                onClick={() =>
                  setCurrentIntervalIndex(currentIntervalIndex - 1)
                }
              >
                <ArrowLeft />
              </IntervalNavigateIconButton>

              <Stack direction="row" gap={1}>
                <Select
                  size="small"
                  value={currentIntervalIndex}
                  onChange={(e) =>
                    setCurrentIntervalIndex(parseInt(e.target.value as string))
                  }
                >
                  {intervals.map((interval, index) => (
                    <MenuItem key={index} value={interval.index}>
                      {interval.label}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  size="small"
                  value={currentIntervalType}
                  onChange={(e) =>
                    setCurrentIntervalType(e.target.value as IntervalType)
                  }
                >
                  <MenuItem value="day">Ngày</MenuItem>
                  <MenuItem value="week">Tuần</MenuItem>
                  <MenuItem value="month">Tháng</MenuItem>
                  <MenuItem value="year">Năm</MenuItem>
                </Select>
              </Stack>

              <IntervalNavigateIconButton
                onClick={() =>
                  setCurrentIntervalIndex(currentIntervalIndex + 1)
                }
              >
                <ArrowRight />
              </IntervalNavigateIconButton>
            </>
          )}
          {timeRangeType === 'custom' && <></>}
        </Grid>
      </Grid>
    </>
  );
};

export default Report;
