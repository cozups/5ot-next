import Link from 'next/link';

import { Clothes } from '@/types/clothes';
import { createClient } from '@/utils/supabase/server';
import { Star } from 'lucide-react';

interface ProductListPageProps {
  params: {
    sex: string;
    category: string;
  };
}

export default async function ProductListPage({
  params,
}: ProductListPageProps) {
  const { sex, category } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('clothes')
    .select()
    .eq('category', `${sex}/${category}`);

  return (
    <div>
      <h2 className="text-3xl font-bold my-4">
        {sex === 'men' ? '남성' : '여성'} {category}
      </h2>
      <div className="grid grid-cols-3 gap-6">
        {/* product list */}
        {data?.map((product: Clothes) => (
          <Link key={product.name} href={`/${sex}/${category}/${product.id}`}>
            <div className="cursor-pointer transition-scale duration-200 hover:scale-105">
              <div className="w-full aspect-square bg-slate-600 rounded-xl" />
              <p className="text-lg font-semibold mt-2">{product.name}</p>
              <div className="flex justify-between mt-3">
                <div className="flex items-center gap-1">
                  <Star fill="orange" className="w-4 h-4" />
                  <span className="text-sm">{product.rate.toFixed(2)}</span>
                </div>
                <div>
                  <span>{product.price.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
