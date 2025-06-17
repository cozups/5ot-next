'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MyPageSideBar() {
  const pathname = usePathname();
  let mode = 'normal';

  if (pathname.startsWith('/admin')) {
    mode = 'admin';
  }

  const menus = {
    admin: [
      { title: '유저 관리', link: '/admin/user' },
      { title: '카테고리 관리', link: '/admin/category' },
      { title: '제품 관리', link: '/admin/product' },
      { title: '문의', link: '/admin/qna' },
    ],
    normal: [
      { title: '내 정보', link: '/mypage' },
      { title: '문의하기', link: '/qna' },
    ],
  };

  return (
    <>
      {mode === 'admin' && (
        <ul className="mx-8">
          {menus[mode].map((menu) => (
            <li
              key={menu.title}
              className={clsx(
                'rounded mb-2',
                pathname === menu.link
                  ? 'bg-blue-200 hover:bg-blue-300'
                  : 'hover:bg-slate-100'
              )}
            >
              <Link href={menu.link} className="w-full block px-2 py-2">
                {menu.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {mode === 'normal' && (
        <ul>
          <li>내 정보</li>
          <li>문의 하기</li>
        </ul>
      )}
    </>
  );
}
