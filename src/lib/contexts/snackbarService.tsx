import { AlertColor } from '@mui/material';
import { createContext, useContext } from 'react';

export interface SnackbarServiceType {
  handleSnackbarAlert: (severity: AlertColor, msg?: string) => void;
}

export const SnackbarService = createContext<SnackbarServiceType>({
  handleSnackbarAlert: (severity: AlertColor, msg?: string) => {},
});

export const useSnackbarService = () => {
  const { handleSnackbarAlert } =
    useContext<SnackbarServiceType>(SnackbarService);

  return handleSnackbarAlert;
};
