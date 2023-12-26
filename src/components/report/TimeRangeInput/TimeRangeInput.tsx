import { Interval, IntervalType, TimeRange } from '@/lib/types/report';
import { ArrowLeft, ArrowRight, SyncAlt } from '@mui/icons-material';
import {
  Button,
  ButtonGroup,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
  styled,
} from '@mui/material';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const IntervalNavigateIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  borderRadius: 4,
  color: 'white',
  width: 80,
  ':hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

export type CustomFromTo = {
  from: Date;
  to: Date;
};

type TimeRangeInputProps = {
  timeRangeType: TimeRange;
  handleTimeRangeTypeChange: (value: TimeRange) => void;
  currentIntervalType: IntervalType;
  handleIntervalTypeChange: (value: IntervalType) => void;
  currentIntervalIndex: number;
  handleCurrentIntervalIndexChange: (value: number) => void;
  intervals: Interval[];
  fromDateToDateText: string;
  customFrom: Date;
  customTo: Date;
  handleCustomFromToChange: (value: CustomFromTo) => void;
};

export function initCustomFromTo() {
  return {
    from: dayjs().startOf('month').toDate(),
    to: dayjs().endOf('month').toDate(),
  };
}

export default function TimeRangeInput({
  timeRangeType,
  handleTimeRangeTypeChange,
  currentIntervalType,
  handleIntervalTypeChange,
  currentIntervalIndex,
  handleCurrentIntervalIndexChange,
  intervals,
  fromDateToDateText,
  customFrom,
  customTo,
  handleCustomFromToChange,
}: TimeRangeInputProps) {
  return (
    <Grid container rowSpacing={2}>
      <Grid item xs={12} display="flex" justifyContent={'center'}>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button
            color={timeRangeType === 'interval' ? 'secondary' : 'primary'}
            onClick={() => handleTimeRangeTypeChange('interval')}
          >
            Khoảng thời gian
          </Button>
          <Button
            color={timeRangeType === 'custom' ? 'secondary' : 'primary'}
            onClick={() => handleTimeRangeTypeChange('custom')}
          >
            Tùy chỉnh
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid item xs={12} display="flex" justifyContent="center" gap={1}>
        {timeRangeType === 'interval' && (
          <>
            <IntervalNavigateIconButton
              onClick={() =>
                handleCurrentIntervalIndexChange(currentIntervalIndex - 1)
              }
            >
              <ArrowLeft />
            </IntervalNavigateIconButton>

            <Stack direction="row" gap={1}>
              <Select
                size="small"
                value={currentIntervalIndex}
                onChange={(e) =>
                  handleCurrentIntervalIndexChange(
                    parseInt(e.target.value as string)
                  )
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
                  handleIntervalTypeChange(e.target.value as IntervalType)
                }
              >
                <MenuItem value="week">Tuần</MenuItem>
                <MenuItem value="month">Tháng</MenuItem>
                <MenuItem value="year">Năm</MenuItem>
              </Select>
            </Stack>

            <IntervalNavigateIconButton
              onClick={() =>
                handleCurrentIntervalIndexChange(currentIntervalIndex + 1)
              }
            >
              <ArrowRight />
            </IntervalNavigateIconButton>
          </>
        )}
        {timeRangeType === 'custom' && (
          <>
            <Stack>
              <Typography typography="body2">Ngày bắt đầu</Typography>
              <DatePicker
                value={dayjs(customFrom)}
                onChange={(date) =>
                  handleCustomFromToChange({
                    from: date?.toDate() ?? customFrom,
                    to: customTo,
                  })
                }
              />
            </Stack>
            <Stack>
              <Typography typography="body2">Ngày kết thúc</Typography>
              <DatePicker
                value={dayjs(customTo)}
                onChange={(date) =>
                  handleCustomFromToChange({
                    from: customFrom,
                    to: date?.toDate() ?? customTo,
                  })
                }
              />
            </Stack>
          </>
        )}
      </Grid>
      <Grid item xs={12}>
        <Typography
          textAlign={'center'}
          typography="body2"
          fontStyle={'italic'}
        >
          {fromDateToDateText}
        </Typography>
      </Grid>
    </Grid>
  );
}
