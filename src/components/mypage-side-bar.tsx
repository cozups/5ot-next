'use client';

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
        <ul>
          {menus[mode].map((menu) => (
            <li key={menu.title}>
              <Link href={menu.link}>{menu.title}</Link>
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
