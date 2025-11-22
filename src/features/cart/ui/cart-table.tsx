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
import { useTransition } from "react";
import { createClient } from "@/utils/supabase/client";

export default function CartTable() {
  const { data: cartData, toggleSelected, removeItem, updateQty, getItem } = useCartStore();
  const { user } = useUser();
  const [, startTransition] = useTransition();

  const onChangeQty = async (cart: Cart, event: React.ChangeEvent<HTMLInputElement>) => {
    const newQty = event.target.value;
    if (user) {
      // DB에도 업데이트
      startTransition(async () => {
        const data = getItem().map((item) => {
          if (item.product.id === cart.product.id) {
            return { ...item, qty: newQty };
          }
          return item;
        });

        const supabase = createClient();
        const { error } = await supabase.from("profiles").update({ cart: data }).eq("id", user.id);

        if (error) {
          toast.error("장바구니 수량 업데이트에 실패했습니다. 다시 시도해주세요.");
        }
      });
    }
    updateQty(cart.product.id, newQty);
  };

  const onRemoveItem = async (productId: string) => {
    if (user) {
      // DB에서도 삭제
      startTransition(async () => {
        const data = getItem().filter((item) => item.product.id !== productId);
        const supabase = createClient();
        const { error } = await supabase.from("profiles").update({ cart: data }).eq("id", user.id);

        if (error) {
          toast.error("장바구니 아이템 삭제에 실패했습니다. 다시 시도해주세요.");
        }
      });
    }
    removeItem(productId);
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
          {cartData.map((cart) => (
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
