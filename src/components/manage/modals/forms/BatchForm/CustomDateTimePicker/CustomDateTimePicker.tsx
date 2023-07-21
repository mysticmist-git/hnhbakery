import { renderTimeViewClock } from '@mui/x-date-pickers';
import {
  DateTimePicker,
  DateTimePickerProps,
} from '@mui/x-date-pickers/DateTimePicker';
import React from 'react';

function CustomDateTimePicker<TDate>(
  props: DateTimePickerProps<TDate> & React.RefAttributes<HTMLDivElement>
) {
  return (
    <DateTimePicker
      {...props}
      format="DD/MM/YYYY | HH:mm"
      // viewRenderers={{
      //   hours: renderTimeViewClock,
      //   minutes: renderTimeViewClock,
      //   seconds: renderTimeViewClock,
      // }}
    />
  );
}

export default CustomDateTimePicker;
