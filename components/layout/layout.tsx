import { ReactNode } from 'react';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { Breadcrumbs } from '../ui/breadcrumbs';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <Breadcrumbs />
      <main>{children}</main>
      <Footer />
    </>
  );
}
