import Footer from '@/components/navigation/Footer';
import { Navbar } from '@/components/navigation/Header';
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
