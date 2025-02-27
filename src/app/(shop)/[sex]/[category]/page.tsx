import { Star } from 'lucide-react';
import Link from 'next/link';

const DUMMY_PRODUCTS = [
  {
    id: 1,
    title: 'Clothes 1',
    href: '/men/menu1/clothes1',
    image: '',
    rate: 5,
    price: 12000,
  },
  {
    id: 2,
    title: 'Clothes 2',
    href: '/men/menu1/clothes2',
    image: '',
    rate: 5,
    price: 12000,
  },
  {
    id: 3,
    title: 'Clothes 3',
    href: '/men/menu1/clothes3',
    image: '',
    rate: 5,
    price: 12000,
  },
  {
    id: 4,
    title: 'Clothes 4',
    href: '/men/menu1/clothes4',
    image: '',
    rate: 5,
    price: 12000,
  },
];

interface ProductListPageProps {
  params: {
    sex: string;
    category: string;
  };
}

export default function ProductListPage({ params }: ProductListPageProps) {
  const { sex, category } = params;

  return (
    <div className="w-[1000px] mx-auto">
      <h2 className="text-3xl font-bold my-4">
        {sex === 'men' ? '남성' : '여성'} {category}
      </h2>
      <div className="grid grid-cols-3 gap-6">
        {/* product list */}
        {DUMMY_PRODUCTS.map((product) => (
          <Link key={product.title} href={`/${sex}/${category}/${product.id}`}>
            <div className="cursor-pointer transition-scale duration-200 hover:scale-105">
              <div className="w-full aspect-square bg-slate-600 rounded-xl" />
              <p className="text-lg font-semibold mt-2">{product.title}</p>
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
