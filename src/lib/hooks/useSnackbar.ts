import { SnackbarProps } from '@mui/material';
import React from 'react';
import { NotifierMessage, NotifierType } from '@/lib/signup';
import { AlertColor } from '@mui/material/Alert';

interface CustomSnackBarProps extends SnackbarProps {
  severity: AlertColor;
}

export default function useSnackbar() {
  const [snackbarProps, setSnackbarProps] = React.useState<CustomSnackBarProps>(
    {
      open: false,
      message: '',
      autoHideDuration: 3000,
      onClose: () => {
        setSnackbarProps({ ...snackbarProps, open: false });
      },
      severity: 'success',
    },
  );

  // notify with snackbar
  const notifier = (type: NotifierType) => {
    switch (type) {
      case NotifierType.SUCCESSFUL:
        setSnackbarProps({
          ...snackbarProps,
          open: true,
          message: NotifierMessage.SUCCESSFUL,
          severity: 'success',
        });
        break;
      case NotifierType.FAIL:
        setSnackbarProps({
          ...snackbarProps,
          open: true,
          message: NotifierMessage.FAIL,
          severity: 'error',
        });
        break;
      case NotifierType.EMPTY_FIELD:
        setSnackbarProps({
          ...snackbarProps,
          open: true,
          message: NotifierMessage.EMPTY_FIELD,
          severity: 'error',
        });
        break;
      case NotifierType.EMAIL_EXISTED:
        setSnackbarProps({
          ...snackbarProps,
          open: true,
          message: NotifierMessage.EMAIL_EXISTED,
          severity: 'error',
        });
        break;
      case NotifierType.NETWORK_ERROR:
        setSnackbarProps({
          ...snackbarProps,
          open: true,
          message: NotifierMessage.NETWORK_ERROR,
          severity: 'error',
        });
        break;
      case NotifierType.ERROR:
        setSnackbarProps({
          ...snackbarProps,
          open: true,
          message: NotifierMessage.ERROR,
          severity: 'error',
        });
        break;
    }
  };

  return { snackbarProps, setSnackbarProps, notifier };
}
