import Link from 'next/link';

import { Products } from '@/types/products';
import { Star } from 'lucide-react';
import Image from 'next/image';

import { getProductsByPagination } from '@/actions/products';
import CustomPagination from '@/components/ui/custom-pagination';
import { cn, getTotalPage } from '@/lib/utils';

interface ProductListPageProps {
  params: Promise<{
    sex: string;
    category: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductListPage({
  params,
  searchParams,
}: ProductListPageProps) {
  const itemsPerPage = 8;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const { sex, category } = await params;
  const { data, count: totalCount } = await getProductsByPagination(
    `${sex}/${category}`,
    {
      pageNum: currentPage,
      itemsPerPage,
    }
  );
  const totalPage = getTotalPage(totalCount || 0, itemsPerPage);

  return (
    <div className="h-full">
      <h2 className="text-3xl font-bold my-4">
        {sex === 'men' ? '남성' : '여성'} {category}
      </h2>
      <div
        className={cn(
          'grid grid-cols-4 grid-rows-2 gap-6',
          data?.length === 0 &&
            'grid-cols-1 grid-rows-1 justify-center items-center h-[calc(100%-5rem)] text-center'
        )}
      >
        {/* product list */}
        {data?.length === 0 && (
          <h2>해당 카테고리의 제품이 존재하지 않습니다.</h2>
        )}
        {data?.map((product: Products) => (
          <Link key={product.name} href={`/${sex}/${category}/${product.id}`}>
            <div className="cursor-pointer transition-scale duration-200 hover:scale-105">
              <div className="w-full aspect-square rounded-xl relative overflow-hidden">
                <Image
                  src={product.image}
                  fill
                  alt={product.name}
                  className="object-cover"
                />
              </div>
              <p className="text-lg font-semibold mt-2">{product.name}</p>
              <p className="text-sm text-gray-400">{product.brand}</p>
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
      {!!totalCount && (
        <CustomPagination currentPage={currentPage} totalPage={totalPage} />
      )}
    </div>
  );
}
