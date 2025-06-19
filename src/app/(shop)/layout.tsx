import SideBar from '@/components/side-bar';
import { ReactNode } from 'react';

export default function ProductListLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="w-full h-full grid grid-cols-[1fr_4fr_1fr]">
      <SideBar />
      <div className="min-h-[calc(100vh-10rem)]">{children}</div>
    </div>
  );
}
