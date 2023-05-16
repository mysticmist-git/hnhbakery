import Snackbar, {
  SnackbarCloseReason,
  SnackbarProps,
} from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import React, { SyntheticEvent } from 'react';

export enum AlertType {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  SUCCESS = 'success',
}

interface CustomSnackbarProps extends SnackbarProps {
  severity: AlertColor;
}

export function CustomSnackbar({
  props,
  setSnackbarProps,
}: {
  props: CustomSnackbarProps;
  setSnackbarProps: any;
}) {
  const handleClose = (
    event: Event | SyntheticEvent<any, Event>,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarProps({
      ...props,
      open: false,
    });
  };

  return (
    <div>
      <Snackbar open={props.open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={props.severity}
          sx={{ width: '100%' }}
        >
          {props.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
