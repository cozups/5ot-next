import CartTable from "@/features/cart/ui/cart-table";
import CartSummary from "@/features/cart/ui/cart-summary";

export const metadata = {
  title: "장바구니 | 5ot Next",
  description: "장바구니 페이지 입니다.",
};

export default function CartPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">장바구니</h1>
      {/* 장바구니 테이블 */}
      <CartTable />
      {/* 구분선 */}
      <div className="h-1 bg-gray-300" />
      {/* 합계 */}
      <CartSummary />
    </div>
  );
}
