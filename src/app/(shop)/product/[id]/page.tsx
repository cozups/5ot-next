import Image from "next/image";
import { notFound } from "next/navigation";

import ProductActionPanel from "@/features/product/components/product-action-panel";
import { getProductById } from "@/features/product/queries";
import { cn } from "@/lib/utils";
import ReviewForm from "@/features/review/ui/review-form";
import ReviewList from "@/features/review/ui/review-list";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/server";
import { getReviewsByPagination } from "@/features/review/queries";
import { Suspense } from "react";
import ReviewListSkeleton from "@/components/skeleton/review-list-skeleton";
import RecentViewedDataSaver from "@/features/product/components/recent-viewed-data-saver";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ page: string }>;
}

export const generateMetadata = async ({ params }: ProductDetailPageProps) => {
  const { id: productId } = await params;
  const supabase = await createClient();
  const { data: product } = await getProductById(supabase, productId);

  if (!product) {
    return {
      title: "Product Not Found | 5ot Next",
      description: "상품을 찾을 수 없습니다.",
    };
  }

  return {
    title: `${product.name} | 5ot Next`,
    description: product.description,
  };
};

export default async function ProductDetailPage({ params, searchParams }: ProductDetailPageProps) {
  const { id: productId } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const supabase = await createClient();
  const { errors: productErrors, data: product } = await getProductById(supabase, productId);

  if (productErrors) {
    throw productErrors;
  }

  if (!product) {
    notFound();
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["reviews", { page: currentPage, productId }],
    queryFn: async () => {
      const response = await getReviewsByPagination(supabase, productId, {
        pageNum: currentPage,
        itemsPerPage: 5,
      });

      if (response.errors) {
        throw new Error(response.errors.message);
      }

      return { data: response.data, count: response.count };
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="py-8">
      {/* product info */}
      <div className={cn("flex flex-col justify-between gap-4", "md:gap-16 md:flex-row")}>
        <div className={cn("w-full aspect-square rounded-xl relative overflow-hidden", "md:w-72", "lg:w-96")}>
          <Image
            src={product.image}
            alt={`${product.name} 제품 사진`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 90vw, 33vw"
            priority
          />
        </div>
        <ProductActionPanel product={product} />
      </div>
      <div>
        {/* reviews */}
        <ReviewForm productId={product.id} />
        <Suspense fallback={<ReviewListSkeleton />}>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <ReviewList page={currentPage} productId={productId} />
          </HydrationBoundary>
        </Suspense>
      </div>
      <RecentViewedDataSaver product={product} />
    </div>
  );
}
