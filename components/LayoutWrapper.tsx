'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/navbar';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNavbarOn = ['/login', '/register', '/admin', '/kurir', '/admin/category', '/admin/menu', '/admin/menu/add', '/admin/category/add', "/admin/kurir", "/admin/reports"];

  const shouldHideNavbar = hideNavbarOn.includes(pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <main>{children}</main>
    </>
  );
}
