import Image from 'next/image';
import { notFound } from 'next/navigation';

import ProductActionPanel from '@/components/product/product-action-panel';
import ReviewForm from '@/components/product/review-form';
import { getReviewsByPagination } from '@/actions/reviews';
import { getProductById } from '@/actions/products';
import { toastError } from '@/lib/utils';
import ReviewList from '@/components/product/review-list';

interface ProductDetailPageProps {
  params: Promise<{
    productId: string;
  }>;
  searchParams: Promise<{ page: string }>;
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: ProductDetailPageProps) {
  const { productId } = await params;
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const { errors: productErrors, data: product } = await getProductById(
    productId
  );
  const { data: reviews, count: reviewTotalCount } =
    await getReviewsByPagination(productId, {
      pageNum: currentPage,
      itemsPerPage: 5,
    });

  if (productErrors) {
    toastError('제품 정보를 불러오던 중 문제가 발생했습니다.', productErrors);
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="py-8">
      {/* product info */}
      <div className="flex justify-between gap-16">
        <div className="w-96 aspect-square  rounded-xl relative overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <ProductActionPanel product={product} />
      </div>
      <div>
        {/* reviews */}
        <ReviewForm productId={product.id} />
        <ReviewList
          initialData={{ data: reviews, count: reviewTotalCount }}
          page={currentPage}
          productId={productId}
        />
      </div>
    </div>
  );
}
