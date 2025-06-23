import Image from 'next/image';
import { notFound } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';
import ProductActionPanel from '@/components/product/product-action-panel';
import ReviewItem from '@/components/product/review-Item';
import { Products, Review } from '@/types/products';
import ReviewForm from '@/components/product/review-form';
import { createReview } from '@/actions/products';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{
    productId: string;
  }>;
}) {
  const { productId } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('products')
    .select()
    .eq('id', productId)
    .single<Products>();

  const { data: reviewList } = await supabase
    .from('reviews')
    .select(`*, products:product_id(*), profiles:user_id(*)`);

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
        <ReviewForm action={createReview.bind(null, product.id)} />
        <div>
          <ul className="flex flex-col gap-6 mt-8">
            {reviewList?.map((review: Review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
