import ProductActionPanel from '@/components/product/product-action-panel';
import { Products } from '@/types/products';
import { createClient } from '@/utils/supabase/server';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

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
        <div>
          <div className="flex items-center gap-2 mt-4">
            <Star fill="orange" className="w-4 h-4" /> 5
          </div>
          <form action="" className="my-4">
            <textarea
              name="review"
              id="review"
              className="w-full border"
              placeholder="리뷰를 작성해 주세요."
              rows={4}
            ></textarea>
            <button className="py-1 px-2 bg-neutral-300 rounded">
              제출하기
            </button>
          </form>
          <ul className="flex flex-col gap-6 mt-8">
            <li>
              <div className="flex items-center gap-4">
                <p className="font-semibold">작성자</p>
                <div className="flex items-center gap-2">
                  <Star fill="orange" className="w-4 h-4" /> 5
                </div>
              </div>
              <div>리뷰 내용</div>
            </li>
            <div>
              <div className="flex items-center gap-4">
                <p className="font-semibold">작성자</p>
                <div className="flex items-center gap-2">
                  <Star fill="orange" className="w-4 h-4" /> 5
                </div>
              </div>
              <div>리뷰 내용</div>
            </div>
            <div>
              <div className="flex items-center gap-4">
                <p className="font-semibold">작성자</p>
                <div className="flex items-center gap-2">
                  <Star fill="orange" className="w-4 h-4" /> 5
                </div>
              </div>
              <div>리뷰 내용</div>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}
