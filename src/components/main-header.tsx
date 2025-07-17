import clsx from 'clsx';
import Link from 'next/link';
import Image from 'next/image';
import { Pacifico } from 'next/font/google';
import { createClient } from '@/utils/supabase/server';
import { logout } from '@/actions/auth';
import { ShoppingBasket } from 'lucide-react';
import { Button } from './ui/button';
import SearchBar from './search-bar';

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
      <div className="flex items-end gap-6">
        <h1
          className={clsx(
            FontPacifico.className,
            'text-4xl  hover:text-neutral-500 transition-colors duration-100 text-black'
          )}
        >
          <Link href="/">5ot</Link>
        </h1>
        <SearchBar />
      </div>
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
        <div className="flex items-center gap-2">
          <Link href="/mypage" className="mr-4">
            <div className="flex gap-2 items-center">
              <div className="w-8 h-8 rounded-full  overflow-hidden relative">
                <Image
                  src={user.user_metadata.image || '/images/user.png'}
                  fill
                  className="w-full object-cover"
                  alt="user profile image"
                />
              </div>
              <p>{user.user_metadata.username}</p>
            </div>
          </Link>
          <Link href="/cart">
            <Button className="flex items-center gap-2 cursor-pointer bg-blue-300 hover:bg-blue-400">
              <ShoppingBasket />
              <span>장바구니</span>
            </Button>
          </Link>
          <form action={logout}>
            <Button className="cursor-pointer">로그아웃</Button>
          </form>
        </div>
      )}
    </div>
  );
}
