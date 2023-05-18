import { AlertColor } from '@mui/material';
import React from 'react';

export default function useSnackbar() {
  //#region States

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState<string | null>('');
  const [snackbarSeverity, setSnackbarSeverity] =
    React.useState<AlertColor>('success');

  //#endregion

  //#region Handlers

  function handleSnackbarAlert(
    severity: AlertColor,
    msg: string = 'Default snackbar text!',
  ) {
    setSnackbarOpen(true);
    setSnackbarText(msg);
    setSnackbarSeverity(severity);
  }
  function handleSnackbarClose() {
    setSnackbarOpen(false);
  }

  //#endregion

  return {
    snackbarOpen,
    snackbarText,
    snackbarSeverity,
    handleSnackbarAlert,
    handleSnackbarClose,
  };
}
