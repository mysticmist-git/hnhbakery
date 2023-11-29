import Footer from '@/components/navigation/Footer';
import { Navbar } from '@/components/navigation/Header';
import { Box } from '@mui/material';
import { memo } from 'react';

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
      <Footer />
    </>
  );
};

export default memo(Layout);
