import { Box } from '@mui/material';
import Footer from '../footer';
import { Navbar } from '@/components/Header';

export default function Layout({ children }: { children: any }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
