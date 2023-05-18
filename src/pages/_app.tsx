import React from 'react';
// import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider, CssBaseline, Alert, Snackbar } from '@mui/material';

// import createEmotionCache from '@/utilities/createEmotionCache';

// const clientSideEmotionCache = createEmotionCache();

import { AppProps } from 'next/app';
import initAuth from '@/next-firebase-auth/initAuth';
import { Router, useRouter } from 'next/router';
import ManageLayout from '@/components/Layouts/ManageLayout';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import useSnackbar from '@/lib/hooks/useSnackbar';
import theme from '@/styles/themes/lightTheme';
import { SnackbarService, TransitionUp } from '@/lib/contexts';
import NProgress from 'nprogress';

//Binding events.

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

//#region Top

// interface MyAppProps extends AppProps {
//   emotionCache: EmotionCache;
// }

initAuth();

//#endregion

const MyApp = (props: AppProps) => {
  // #region States

  // #endregion

  //#region Hooks

  const { Component, pageProps } = props;
  const router = useRouter();

  const CurrentLayout = router.pathname.includes('/manager')
    ? ManageLayout
    : DefaultLayout;

  //#endregion

  //#region useEffects

  //#endregion

  //#region Snackbar

  const {
    snackbarOpen,
    snackbarText,
    snackbarSeverity,
    handleSnackbarAlert,
    handleSnackbarClose,
  } = useSnackbar();

  //#endregion

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* <CacheProvider value={emotionCache}> */}
      <ThemeProvider theme={theme}>
        <SnackbarService.Provider value={{ handleSnackbarAlert }}>
          <CssBaseline />
          <CurrentLayout>
            <Component {...pageProps} />
          </CurrentLayout>
          )
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
      </ThemeProvider>
      {/* </CacheProvider> */}
    </LocalizationProvider>
  );
};

export default MyApp;
