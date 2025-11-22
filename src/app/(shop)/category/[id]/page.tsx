import { Suspense } from "react";

import ProductList from "@/features/product/components/product-list";
import ProductItemSkeleton from "@/components/skeleton/product-item-skeleton";
import { cn } from "@/lib/utils";

interface ProductListPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductListPage({ params, searchParams }: ProductListPageProps) {
  const { id } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  return (
    <Suspense
      fallback={
        <div className={cn("grid grid-cols-2 grid-rows-2 gap-6", "md:grid-cols-4")}>
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductItemSkeleton key={index} />
          ))}
        </div>
      }
    >
      <ProductList categoryId={id} currentPage={currentPage} />
    </Suspense>
  );
}
