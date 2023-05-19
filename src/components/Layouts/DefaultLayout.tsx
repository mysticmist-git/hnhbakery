import { Box } from '@mui/material';
import { memo } from 'react';
import Footer from '../footer';
import { Navbar } from '@/components/Header';

const Layout = ({ children }: { children: any }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default memo(Layout);
