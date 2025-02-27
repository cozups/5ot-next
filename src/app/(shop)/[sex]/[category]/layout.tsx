import SideBar from '@/components/side-bar';
import { ReactNode } from 'react';

export default function ProductListLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-10rem)]">
      <SideBar />
      {children}
    </div>
  );
}
