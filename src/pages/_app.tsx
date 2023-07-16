import '@/styles/nprogress.scss';
import { Alert, CssBaseline, Snackbar, ThemeProvider } from '@mui/material';
import NProgress, { set } from 'nprogress';
import React, { useEffect, useReducer, useState } from 'react';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

// import createEmotionCache from '@/utilities/createEmotionCache';

// const clientSideEmotionCache = createEmotionCache();

import { TransitionUp } from '@/components/Transitions';
import MainLayout from '@/components/layouts/MainLayout';
import { auth } from '@/firebase/config';
import { COLLECTION_NAME } from '@/lib/constants';
import { SnackbarService } from '@/lib/contexts';
import {
  AppContext,
  appReducer,
  initialState,
} from '@/lib/contexts/appContext';
import { getDocFromFirestore } from '@/lib/firestore';
import useSnackbar from '@/lib/hooks/useSnackbar';
import { UserObject } from '@/lib/models';
import theme from '@/styles/themes/lightTheme';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Router, useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';

const unauthorizedPaths: { [path: string]: string[] } = {
  customer: ['/manager'],
  manager: ['/'],
  // Add other roles and paths here
};

const MyApp = (props: AppProps) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState<UserObject | null>(null);

  const { Component, pageProps } = props;
  const router = useRouter();

  const {
    snackbarOpen,
    snackbarText,
    snackbarSeverity,
    handleSnackbarAlert,
    handleSnackbarClose,
  } = useSnackbar();

  //#endregion

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        setUserData(null);
        return;
      }

      const userData = await getDocFromFirestore<UserObject>(
        COLLECTION_NAME.USERS,
        user.uid
      );

      setUserData(userData);
    };

    if (user && !loading) {
    }
  }, [user, loading]);

  useEffect(() => {
    if (!userData) return;

    console.log(userData);
    const role = userData.role_id;

    // Redirects user to a certain page if they are on an unauthorized path
    const handleUnauthorizedPaths = (role: string) => {
      const rolePaths = unauthorizedPaths[role];

      console.log(role, rolePaths);

      if (rolePaths && rolePaths.includes(router.pathname)) {
        console.log('this run');
        router.push('/');
      }
    };

    handleUnauthorizedPaths(role);
  }, [router.pathname, userData]);

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
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
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
      </LocalizationProvider>
    </>
  );
};

export default MyApp;
