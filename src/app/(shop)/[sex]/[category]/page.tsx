import ProductList from "@/components/product/product-list";
import ProductItemSkeleton from "@/components/skeleton/product-item-skeleton";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

interface ProductListPageProps {
  params: Promise<{
    sex: string;
    category: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const generateMetadata = async ({ params }: ProductListPageProps) => {
  const { sex, category } = await params;
  return {
    title: `${sex}/${category} | 5ot Next`,
    description: `${sex}/${category} 카테고리 페이지 입니다.`,
  };
};

export default async function ProductListPage({ params, searchParams }: ProductListPageProps) {
  const { sex, category } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  return (
    <div className="h-full">
      <h2 className="text-3xl font-bold my-4">
        {sex === "men" ? "남성" : "여성"} {category}
      </h2>

      {/* product list */}
      <Suspense
        fallback={
          <div className={cn("grid grid-cols-2 grid-rows-2 gap-6", "md:grid-cols-4")}>
            {Array.from({ length: 8 }).map(() => (
              <ProductItemSkeleton key={Math.random() * 1000} />
            ))}
          </div>
        }
      >
        <ProductList category={`${sex}/${category}`} currentPage={currentPage} />
      </Suspense>
    </div>
  );
}
