import Footer from '../footer';
import { Navbar } from '@/components/Header';

export default function Layout({ children }: { children: any }) {
  return (
    <>
      <Navbar />
      <div style={{ height: '80px' }}></div>
      {children}
      <Footer />
    </>
  );
}
