import { memo } from 'react';
import Footer from '../footer';
import { Navbar } from '@/components/Header';

const Layout = ({ children }: { children: any }) => {
  return (
    <>
      <Navbar />
      <div style={{ height: '80px' }}></div>
      {children}
      <Footer />
    </>
  );
};

export default memo(Layout);
