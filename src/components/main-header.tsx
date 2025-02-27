'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Pacifico } from 'next/font/google';

const FontPacifico = Pacifico({
  subsets: ['latin'],
  weight: ['400'],
});

export default function MainHeader() {
  const path = usePathname();

  return (
    <div
      className={clsx(
        'w-full flex justify-between items-center py-4 px-8',
        `${path === '/' ? 'absolute top-0 left-0 z-[1]' : undefined}`
      )}
    >
      <h1
        className={clsx(
          FontPacifico.className,
          'text-4xl  hover:text-neutral-500 transition-colors duration-100',
          `${path === '/' ? 'text-white' : 'text-black'}`
        )}
      >
        <Link href="/">5ot</Link>
      </h1>
      <nav>
        <ul
          className={clsx(
            'flex gap-2',
            `${path === '/' ? 'text-white' : 'text-black'}`
          )}
        >
          <li>
            <Link href="/login">로그인</Link>
          </li>
          <li>
            <Link href="/join">회원가입</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
