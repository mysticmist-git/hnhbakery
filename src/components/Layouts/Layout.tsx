import { Router, useRouter } from 'next/router';
import React, { useMemo } from 'react';
import ManageLayout from './ManageLayout';
import DefaultLayout from './DefaultLayout';
import Head from 'next/head';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const CurrentLayout = useMemo(
    () => (router.pathname.includes('/manager') ? ManageLayout : DefaultLayout),
    [router.pathname],
  );

  return (
    <>
      <Head>
        <title>H&H Bakery</title>
      </Head>
      <CurrentLayout>{children}</CurrentLayout>;
    </>
  );
};

export default Layout;
