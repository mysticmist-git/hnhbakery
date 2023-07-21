import Footer from '@/components/Navigation/Footer';
import { Navbar } from '@/components/Navigation/Header';
import { memo } from 'react';

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
