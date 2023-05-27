import { Router, useRouter } from 'next/router';
import React, { useMemo } from 'react';
import ManageLayout from './ManageLayout';
import DefaultLayout from './DefaultLayout';
import Head from 'next/head';
import NoLayout from './components/NoLayout';

const pathnameResolver = (pathname: string, desiredPaths: string[]) => {
  for (const desiredPath of desiredPaths) {
    if (pathname.includes(desiredPath)) {
      return true;
    }
  }

  return false;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const CurrentLayout = useMemo(() => {
    if (pathnameResolver(router.pathname, ['manage'])) {
      return ManageLayout;
    } else {
      return DefaultLayout;
    }
  }, [router.pathname]);

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
