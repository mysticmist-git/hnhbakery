import React from 'react';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider, CssBaseline } from '@mui/material';

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

interface MyAppProps extends AppProps {
  emotionCache: EmotionCache;
}

initAuth();

const MyApp = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();

  const CurrentLayout = router.pathname.includes('/manager')
    ? ManageLayout
    : DefaultLayout;

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CurrentLayout>
          <Component {...pageProps} />
        </CurrentLayout>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;
