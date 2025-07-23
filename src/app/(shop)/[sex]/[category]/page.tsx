import Link from 'next/link';

import { Products } from '@/types/products';
import { Star } from 'lucide-react';
import Image from 'next/image';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { getProductsByPagination } from '@/actions/products';

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

  const totalPage = totalCount ? Math.ceil(totalCount / itemsPerPage) : 1;
  const groupSize = 10;
  const groupIndex = Math.floor((currentPage - 1) / groupSize);

  const getPaginationList = () => {
    const startPage = groupIndex * groupSize + 1;
    const endPage = Math.min(startPage + groupSize - 1, totalPage);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const paginationList = getPaginationList();

  return (
    <div>
      <h2 className="text-3xl font-bold my-4">
        {sex === 'men' ? '남성' : '여성'} {category}
      </h2>
      <div className="grid grid-cols-4 grid-rows-2 gap-6">
        {/* product list */}
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
      <Pagination className="my-8">
        <PaginationContent>
          {groupIndex > 0 && (
            <PaginationPrevious href={`?page=${paginationList[0] - 1}`} />
          )}
          {paginationList.map((pageNum: number) => (
            <PaginationItem key={`page-${pageNum}`}>
              <PaginationLink
                href={`?page=${pageNum}`}
                isActive={pageNum === currentPage}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          ))}
          {groupIndex < Math.floor(totalPage / groupSize) && (
            <PaginationNext href={`?page=${paginationList[9] + 1}`} />
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
