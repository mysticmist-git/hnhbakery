import Navbar from '@/components/Header/Navbar';
import Footer from '@/components/Footer';

export default function Layout({ children }: { children: any }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
