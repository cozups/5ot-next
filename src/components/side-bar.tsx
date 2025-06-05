import Link from 'next/link';

import { Category } from '@/types/category';
import { createClient } from '@/utils/supabase/server';
import SideBarWrapper from './side-bar-wrapper';

export default async function SideBar() {
  const supabase = await createClient();
  const { data } = await supabase.from('category').select();

  return (
    <SideBarWrapper>
      <div>
        <h2 className="text-2xl my-1 font-semibold">Men</h2>
        <ul>
          {(data as Category[])
            ?.filter((category) => category.sex === 'men')
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
          {(data as Category[])
            ?.filter((category) => category.sex === 'women')
            .map((menu) => (
              <li key={menu.id}>
                <Link href={`/${menu.sex}/${menu.name}`}>{menu.name}</Link>
              </li>
            ))}
        </ul>
      </div>
    </SideBarWrapper>
  );
}
