import { Clothes } from '@/types/clothes';
import { createClient } from '@/utils/supabase/server';
import { Star } from 'lucide-react';
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
    .from('clothes')
    .select()
    .eq('id', productId)
    .single<Clothes>();

  if (!product) {
    notFound();
  }

  return (
    <div className="py-8">
      {/* product info */}
      <div className="flex justify-between gap-16">
        <div className="w-96 aspect-square bg-slate-700 rounded-xl " />
        <div className="flex-1 flex flex-col justify-between">
          <div className="h-[80%] flex flex-col items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{product.name}</h2>
              <p>{product.brand}</p>
            </div>

            <div className="w-full flex flex-col items-start">
              <p>{product.description}</p>
              <div className="w-full mt-8 flex items-center justify-between">
                <input
                  type="number"
                  min={1}
                  className="px-4 border h-10"
                  defaultValue={1}
                />
                <p className="font-bold">{product.price.toLocaleString()}원</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-1/2 h-16 bg-neutral-300 rounded">
              장바구니
            </button>
            <button className="w-1/2 h-16 bg-blue-950 text-white rounded">
              구매하기
            </button>
          </div>
        </div>
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
          <div className="flex flex-col gap-6 mt-8">
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
            <div>
              <div className="flex items-center gap-4">
                <p className="font-semibold">작성자</p>
                <div className="flex items-center gap-2">
                  <Star fill="orange" className="w-4 h-4" /> 5
                </div>
              </div>
              <div>리뷰 내용</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
