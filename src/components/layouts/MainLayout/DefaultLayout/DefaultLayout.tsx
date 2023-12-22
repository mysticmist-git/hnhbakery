import Footer from '@/components/navigation/Footer';
import { Navbar } from '@/components/navigation/Header';
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { memo } from 'react';
import { LiveChat } from '../../../livechat/LiveChat';

const Layout = ({ children }: { children: any }) => {
  return (
    <>
      <Navbar />

      <Box
        component={'div'}
        sx={{
          minHeight: '60vh',
        }}
      >
        {children}
      </Box>
      <LiveChat />
      <Footer />
    </>
  );
};

export default memo(Layout);
