'use client';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Category } from '@/types/category';
import { createClient } from '@/utils/supabase/client';

export default function SideBar() {
  const path = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function getCategories() {
      const supabase = createClient();

      try {
        const { data } = await supabase.from('category').select();

        setCategories(data as Category[]);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log('알 수 없는 에러:', error);
        }
      }
    }

    getCategories();
  });
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
          {categories
            .filter((category) => category.sex === 'men')
            .map((menu) => (
              <li key={menu.id}>
                <Link href={`/${menu.sex}/${menu.name}`}>{menu.name}</Link>
              </li>
            ))}
        </ul>
      </div>
      <div>
        <h2 className="text-2xl my-1 font-semibold">Woman</h2>
        <ul>
          {categories
            .filter((category) => category.sex === 'women')
            .map((menu) => (
              <li key={menu.id}>
                <Link href={`/${menu.sex}/${menu.name}`}>{menu.name}</Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
