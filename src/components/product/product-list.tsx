'use client';

import Link from 'next/link';

import { Products } from '@/types/products';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getProductsByPagination } from '@/actions/products';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import ProductItemSkeleton from '../skeleton/product-item-skeleton';
import ProductItem from './product-item';

export default function ProductList({
  initialData,
  page,
  category,
}: {
  initialData: Products[] | null | undefined;
  page: number;
  category: string;
}) {
  const itemsPerPage = 8;
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ['products', category, page],
    queryFn: async () => {
      const { data } = await getProductsByPagination(category, {
        pageNum: page,
        itemsPerPage,
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
    initialData,
    placeholderData: keepPreviousData,
  });

  if (isError) {
    toast.error('제품 로딩 중 문제가 발생했습니다.', {
      description: error.message,
    });
  }

  return (
    <div
      className={cn(
        'grid grid-cols-4 grid-rows-2 gap-6',
        data?.length === 0 &&
          'grid-cols-1 grid-rows-1 justify-center items-center h-[calc(100%-5rem)] text-center'
      )}
    >
      {data?.length === 0 && <h2>해당 카테고리의 제품이 존재하지 않습니다.</h2>}
      {isLoading &&
        Array.from({ length: 8 }).map((_, i) => (
          <ProductItemSkeleton key={`${category}-${i}`} />
        ))}
      {isSuccess &&
        data?.map((product: Products) => (
          <Link key={product.name} href={`/${category}/${product.id}`}>
            <ProductItem product={product} />
          </Link>
        ))}
    </div>
  );
}
