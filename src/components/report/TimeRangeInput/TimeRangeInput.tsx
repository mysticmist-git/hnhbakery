import { Interval, IntervalType, TimeRange } from '@/lib/types/report';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
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

const IntervalNavigateIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  borderRadius: 4,
  color: 'white',
  width: 80,
  ':hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

type TimeRangeInput = {
  timeRangeType: TimeRange;
  handleTimeRangeTypeChange: (value: TimeRange) => void;
  currentIntervalType: IntervalType;
  handleIntervalTypeChange: (value: IntervalType) => void;
  currentIntervalIndex: number;
  handleCurrentIntervalIndexChange: (value: number) => void;
  intervals: Interval[];
  fromDateToDateText: string;
};

export default function TimeRangeInput({
  timeRangeType,
  handleTimeRangeTypeChange,
  currentIntervalType,
  handleIntervalTypeChange,
  currentIntervalIndex,
  handleCurrentIntervalIndexChange,
  intervals,
  fromDateToDateText,
}: TimeRangeInput) {
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
                <MenuItem value="day">Ngày</MenuItem>
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
        {timeRangeType === 'custom' && <></>}
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
