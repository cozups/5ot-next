"use client";

import Image from "next/image";
import { Trash } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { Cart } from "@/types/cart";
import { useUser } from "@/hooks/use-users";
import { toast } from "sonner";
import { useEffect, useTransition } from "react";
import { createClient } from "@/utils/supabase/client";
import { getCartDataFromDB } from "../queries";
import { arrangeProductDataByTime } from "@/lib/arrange-product-data-by-time";

export default function CartTable() {
  const { data, toggleSelected, removeItem, updateQty, getItem, setItem } = useCartStore();
  const { user } = useUser();
  const [, startTransition] = useTransition();
  const supabase = createClient();

  useEffect(() => {
    async function fetchCartData() {
      // DB에서 장바구니 데이터 불러오기
      const { data: fetchedData, errors } = await getCartDataFromDB(supabase, user!.id);

      if (errors) {
        toast.error("장바구니 데이터를 불러오는 중 오류가 발생했습니다.", { description: errors.message });
        return;
      }

      // 로컬 스토리지와 병합 (시간순)
      const finalCartData = arrangeProductDataByTime(fetchedData, data);
      setItem(finalCartData);

      // 병합된 데이터로 DB 데이터 동기화
      const { error } = await supabase.from("profiles").update({ cart: finalCartData }).eq("id", user!.id);

      if (error) {
        toast.error("장바구니 데이터 업데이트에 실패했습니다. 다시 시도해주세요.");
      }
    }

    if (user) {
      fetchCartData();
    }
  }, [user, supabase, setItem, arrangeProductDataByTime]);

  const onChangeQty = async (cart: Cart, event: React.ChangeEvent<HTMLInputElement>) => {
    const newQty = event.target.value;
    updateQty(cart.product.id, newQty);

    if (user) {
      // DB에도 업데이트
      startTransition(async () => {
        const updatedData = getItem();

        const { error } = await supabase.from("profiles").update({ cart: updatedData }).eq("id", user.id);

        if (error) {
          toast.error("장바구니 수량 업데이트에 실패했습니다. 다시 시도해주세요.");
        }
      });
    }
  };

  const onRemoveItem = async (productId: string) => {
    removeItem(productId);
    if (user) {
      // DB에서도 삭제
      startTransition(async () => {
        const data = getItem();

        const { error } = await supabase.from("profiles").update({ cart: data }).eq("id", user.id);

        if (error) {
          toast.error("장바구니 아이템 삭제에 실패했습니다. 다시 시도해주세요.");
        }
      });
    }
  };

  return (
    <div className="min-h-96 max-h-[36rem] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>상품</TableHead>
            <TableHead>가격</TableHead>
            <TableHead>개수</TableHead>
            <TableHead>관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((cart) => (
            <TableRow key={cart.product.id}>
              <TableCell>
                <Checkbox
                  defaultChecked={cart.isSelected}
                  onCheckedChange={toggleSelected.bind(null, cart.product.id)}
                />
              </TableCell>
              <TableCell className="flex items-center gap-4">
                <div className="w-16 aspect-square relative">
                  <Image src={cart.product.image} fill alt={cart.product.name} className="object-cover" sizes="10vw" />
                </div>
                <p>{cart.product.name}</p>
              </TableCell>
              <TableCell>{cart.product.price.toLocaleString()}원</TableCell>
              <TableCell>
                <Input
                  type="number"
                  min={1}
                  defaultValue={cart.qty}
                  className="w-24"
                  onChange={onChangeQty.bind(null, cart)}
                />
              </TableCell>
              <TableCell>
                <div>
                  <Button
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() => onRemoveItem(cart.product.id)}
                  >
                    <Trash />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
