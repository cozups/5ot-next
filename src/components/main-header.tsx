import clsx from 'clsx';
import Link from 'next/link';
import { Pacifico } from 'next/font/google';
import { createClient } from '@/utils/supabase/server';

const FontPacifico = Pacifico({
  subsets: ['latin'],
  weight: ['400'],
});

export default async function MainHeader() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const { user } = data;

  return (
    <div className={clsx('w-full h-20 flex justify-between items-center px-8')}>
      <h1
        className={clsx(
          FontPacifico.className,
          'text-4xl  hover:text-neutral-500 transition-colors duration-100 text-black'
        )}
      >
        <Link href="/">5ot</Link>
      </h1>
      {!user && (
        <nav>
          <ul className={clsx('flex gap-2 text-black')}>
            <li>
              <Link href="/login">로그인</Link>
            </li>
            <li>
              <Link href="/join">회원가입</Link>
            </li>
          </ul>
        </nav>
      )}
      {user && (
        <div>
          <button>로그아웃</button>
        </div>
      )}
    </div>
  );
}
