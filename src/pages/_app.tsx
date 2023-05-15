import React, { useContext } from 'react';
import { CacheProvider, EmotionCache } from '@emotion/react';
import {
  ThemeProvider,
  CssBaseline,
  Alert,
  Snackbar,
  AlertColor,
} from '@mui/material';

import createEmotionCache from '@/utilities/createEmotionCache';
import theme from '../styles/themes/lightTheme';
import '../styles/globals.css';

const clientSideEmotionCache = createEmotionCache();

import Layout from '@/components/Layouts/DefaultLayout';
import { AppProps } from 'next/app';
import initAuth from '@/next-firebase-auth/initAuth';
import { useRouter } from 'next/router';
import ManageLayout from '@/components/Layouts/ManageLayout';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createContext } from 'react';
import useSnackbar2 from '@/lib/hooks/useSnackbar2';
interface MyAppProps extends AppProps {
  emotionCache: EmotionCache;
}

initAuth();

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

const MyApp = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();

  const CurrentLayout = router.pathname.includes('/manager')
    ? ManageLayout
    : DefaultLayout;

  //#region Snackbar

  const {
    snackbarOpen,
    snackbarText,
    snackbarSeverity,
    handleSnackbarAlert,
    handleSnackbarClose,
  } = useSnackbar2();

  //#endregion

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <SnackbarService.Provider value={{ handleSnackbarAlert }}>
            <CssBaseline />
            <CurrentLayout>
              <Component {...pageProps} />
            </CurrentLayout>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleSnackbarClose}
            >
              <Alert
                onClose={handleSnackbarClose}
                severity={snackbarSeverity}
                sx={{ width: '100%' }}
              >
                {snackbarText}
              </Alert>
            </Snackbar>
          </SnackbarService.Provider>
        </ThemeProvider>
      </CacheProvider>
    </LocalizationProvider>
  );
};

export default MyApp;
