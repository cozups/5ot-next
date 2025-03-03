'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function SideBarWrapper({ children }: { children: ReactNode }) {
  const path = usePathname();
  return (
    <div
      className={clsx(
        'w-48 ml-4 pl-8 py-8',
        `${
          path === '/' ? 'absolute bg-black/30 text-white' : 'fixed'
        } top-1/2 -translate-y-1/2`,
        'flex flex-col gap-4'
      )}
    >
      {children}
    </div>
  );
}
