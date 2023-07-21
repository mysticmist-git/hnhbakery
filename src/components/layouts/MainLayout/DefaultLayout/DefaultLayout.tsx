import { Navbar } from '@/components/Navigation/Header';
import { memo } from 'react';
import Footer from '../../../Navigation/Footer/Footer';

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
