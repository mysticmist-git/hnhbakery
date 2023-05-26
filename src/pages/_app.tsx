import React, { useReducer, useState } from 'react';
// import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider, CssBaseline, Alert, Snackbar } from '@mui/material';
import '@/styles/nprogress.scss';
import NProgress from 'nprogress';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

// import createEmotionCache from '@/utilities/createEmotionCache';

// const clientSideEmotionCache = createEmotionCache();

import { AppProps } from 'next/app';
import { Router, useRouter } from 'next/router';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import useSnackbar from '@/lib/hooks/useSnackbar';
import theme from '@/styles/themes/lightTheme';
import { SnackbarService } from '@/lib/contexts';
import { TransitionUp } from '@/components/Transitions';
import {
  AppContext,
  appReducer,
  initialState,
} from '@/lib/contexts/appContext';
import { DisplayCartItem } from '@/lib/contexts/cartContext';
import Layout from '@/components/Layouts/Layout';
import Head from 'next/head';

const MyApp = (props: AppProps) => {
  // #region States

  // For the cart and payment page
  const [state, dispatch] = useReducer(appReducer, initialState);

  // #endregion

  //#region Hooks

  const { Component, pageProps } = props;

  const {
    snackbarOpen,
    snackbarText,
    snackbarSeverity,
    handleSnackbarAlert,
    handleSnackbarClose,
  } = useSnackbar();

  //#endregion

  return (
    <>
      <Head>
        <title>H&H Bakery</title>
      </Head>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* <CacheProvider value={emotionCache}> */}
        <ThemeProvider theme={theme}>
          <AppContext.Provider value={{ state, dispatch }}>
            <SnackbarService.Provider value={{ handleSnackbarAlert }}>
              <CssBaseline />
              <Layout>
                <Component {...pageProps} />
              </Layout>
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                TransitionComponent={TransitionUp}
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
          </AppContext.Provider>
        </ThemeProvider>
        {/* </CacheProvider> */}
      </LocalizationProvider>
    </>
  );
};

export default MyApp;
