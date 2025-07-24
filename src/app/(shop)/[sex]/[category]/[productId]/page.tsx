import Image from 'next/image';
import { notFound } from 'next/navigation';

import ProductActionPanel from '@/components/product/product-action-panel';
import ReviewItem from '@/components/product/review-Item';
import { Review } from '@/types/products';
import ReviewForm from '@/components/product/review-form';
import { getReviews, getReviewsByPagination } from '@/actions/reviews';
import { getProductById } from '@/actions/products';
import { getTotalPage, toastError } from '@/lib/utils';
import CustomPagination from '@/components/ui/custom-pagination';

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
  const {
    errors: reviewErrors,
    data: reviews,
    count: reviewTotalCount,
  } = await getReviewsByPagination(productId, {
    pageNum: currentPage,
    itemsPerPage: 5,
  });
  const totalPage = getTotalPage(reviewTotalCount || 0, 5);

  if (productErrors) {
    toastError('제품 정보를 불러오던 중 문제가 발생했습니다.', productErrors);
  }

  if (reviewErrors) {
    toastError('리뷰를 불러오던 중 문제가 발생했습니다.', reviewErrors);
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
        <div>
          <ul className="flex flex-col gap-6 mt-8">
            {reviews?.map((review: Review) => (
              <ReviewItem key={review.id} review={review} panel />
            ))}
          </ul>
        </div>
        {!!reviewTotalCount && (
          <CustomPagination currentPage={currentPage} totalPage={totalPage} />
        )}
      </div>
    </div>
  );
}
