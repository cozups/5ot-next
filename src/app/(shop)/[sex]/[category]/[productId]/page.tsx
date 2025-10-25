import Image from "next/image";
import { notFound } from "next/navigation";

import ProductActionPanel from "@/features/product/ui/product-action-panel";
import { getProductById } from "@/features/product/actions";
import { cn } from "@/lib/utils";
import ReviewForm from "@/features/review/ui/review-form";
import ReviewList from "@/features/review/ui/review-list";

interface ProductDetailPageProps {
  params: Promise<{
    productId: string;
  }>;
  searchParams: Promise<{ page: string }>;
}

export const generateMetadata = async ({ params }: ProductDetailPageProps) => {
  const { productId } = await params;
  const { data: product } = await getProductById(productId);

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
  const { productId } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const { errors: productErrors, data: product } = await getProductById(productId);

  if (productErrors) {
    throw productErrors;
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="py-8">
      {/* product info */}
      <div className={cn("flex flex-col justify-between gap-4", "md:gap-16 md:flex-row")}>
        <div className={cn("w-full aspect-square rounded-xl relative overflow-hidden", "md:w-72", "lg:w-96")}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 90vw, 33vw"
          />
        </div>
        <ProductActionPanel product={product} />
      </div>
      <div>
        {/* reviews */}
        <ReviewForm productId={product.id} />
        <ReviewList page={currentPage} productId={productId} />
      </div>
    </div>
  );
}
