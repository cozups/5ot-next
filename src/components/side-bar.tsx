'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menMenus = [
  { name: 'menu 1', href: '/men/menu1' },
  { name: 'menu 2', href: '/men/menu2' },
  { name: 'menu 3', href: '/men/menu3' },
  { name: 'menu 4', href: '/men/menu4' },
];

const womanMenus = [
  { name: 'menu 1', href: '/woman/menu1' },
  { name: 'menu 2', href: '/woman/menu2' },
  { name: 'menu 3', href: '/woman/menu3' },
  { name: 'menu 4', href: '/woman/menu4' },
];

export default function SideBar() {
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
      <div>
        <h2 className="text-2xl my-1 font-semibold">Men</h2>
        <ul>
          {menMenus.map((menu) => (
            <li key={menu.href}>
              <Link href={menu.href}>{menu.name}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-2xl my-1 font-semibold">Woman</h2>
        <ul>
          {womanMenus.map((menu) => (
            <li key={menu.href}>
              <Link href={menu.href}>{menu.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
