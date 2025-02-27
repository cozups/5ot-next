import { Star } from 'lucide-react';

export default function ProductDetailPage({
  params,
}: {
  params: {
    productId: string;
  };
}) {
  const { productId } = params;
  return (
    <div className="w-[1000px] mx-auto py-8">
      {/* product info */}
      <div className="flex justify-between gap-16">
        <div className="w-96 aspect-square bg-slate-700 rounded-xl " />
        <div className="flex-1 flex flex-col justify-between">
          <div className="h-[80%] flex flex-col items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Clothes {productId}</h2>
              <p>제조사</p>
            </div>

            <div className="flex flex-col items-start">
              <p>
                제품설명 Lorem ipsum dolor sit amet consectetur, adipisicing
                elit. Distinctio alias blanditiis veritatis, commodi accusamus
                quia ea a eius sunt sed.
              </p>
              <div className="w-full mt-8 flex items-center justify-between">
                <input
                  type="number"
                  min={1}
                  className="px-4 border h-10"
                  defaultValue={1}
                />
                <p>12000원</p>
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
