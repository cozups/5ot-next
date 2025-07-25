import MainImageSlider from '@/components/main-image-slider';
import SideBar from '@/components/side-bar';
import { Products } from '@/types/products';
import { createClient } from '@/utils/supabase/server';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select()
    .order('created_at', { ascending: false })
    .limit(4);

  return (
    <div className="w-full h-full min-h-[calc(100vh-10rem)] grid grid-cols-[1fr_4fr_1fr]">
      <SideBar />
      <div className="w-full">
        <MainImageSlider />
        {data && data.length > 0 && (
          <div>
            <h2 className="my-4 text-2xl font-bold">new</h2>
            <div className="grid grid-cols-4 gap-4">
              {data.map((product: Products) => (
                <div
                  key={product.id}
                  className="w-full h-56 rounded-lg relative overflow-hidden group"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />

                  <Link href={`/${product.category}/${product.id}`}>
                    <div
                      className={clsx(
                        'bg-[rgba(0,0,0,0.25)] absolute top-0 left-0 w-full h-full cursor-pointer',
                        'flex items-center justify-center',
                        'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                      )}
                    >
                      <p className="text-white font-semibold">{product.name}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
