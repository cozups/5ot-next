"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";

export default function CartSummary() {
  const { data } = useCartStore();
  const router = useRouter();

  const selectedCart = data.filter((item) => item.isSelected);
  const totalPrice = selectedCart.reduce((acc, data) => acc + parseInt(data.product.price) * parseInt(data.qty), 0);

  const onClickPurchase = () => {
    const data = selectedCart.map((item) => ({
      product: item.product,
      qty: item.qty,
    }));
    sessionStorage.setItem("purchase", JSON.stringify(data));
    router.push("/purchase");
  };

  return (
    <div className="bg-slate-100 p-4 mt-4 rounded-xl">
      <h2 className="text-lg font-semibold">합계</h2>
      <div className="flex flex-col">
        <div className="max-w-96 h-32 overflow-auto">
          {selectedCart.length === 0 && <p className="text-sm">선택된 상품이 없습니다.</p>}
          {selectedCart.length > 0 &&
            selectedCart.map((data) => (
              <div key={data.product.id} className="text-sm flex justify-between items-center">
                <p>
                  {data.product.name} X {data.qty}
                </p>
                <p>{(parseInt(data.product.price) * parseInt(data.qty)).toLocaleString()}원</p>
              </div>
            ))}
        </div>
        <div className="self-end flex flex-col items-end gap-2">
          <p className="font-semibold">총 {totalPrice.toLocaleString()}원</p>
          <Link href="/purchase">
            <Button className="cursor-pointer" onClick={onClickPurchase}>
              선택 상품 구매하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
