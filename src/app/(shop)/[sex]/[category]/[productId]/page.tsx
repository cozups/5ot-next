import Image from 'next/image';
import { notFound } from 'next/navigation';

import ProductActionPanel from '@/components/product/product-action-panel';
import ReviewItem from '@/components/product/review-Item';
import { Review } from '@/types/products';
import ReviewForm from '@/components/product/review-form';
import { getReviews } from '@/actions/reviews';
import { getProductById } from '@/actions/products';
import { toastError } from '@/lib/utils';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{
    productId: string;
  }>;
}) {
  const { productId } = await params;
  const { errors: productErrors, data: product } = await getProductById(
    productId
  );
  const { errors: reviewErrors, data: reviews } = await getReviews(productId);

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
              <ReviewItem key={review.id} review={review} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
