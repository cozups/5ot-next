"use client";

import { OrderFormState } from "@/features/order/actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInvalidateCache } from "@/hooks/useInvalidateCache";
import { useFormTransition } from "@/hooks/use-form-transition";

export default function OrderStatusAction({
  defaultValue,
  action,
}: {
  defaultValue: string;
  action: (id: string) => Promise<OrderFormState>;
}) {
  const { invalidateCache } = useInvalidateCache(["orders", "admin"]);
  const { execute } = useFormTransition(action, {
    onSuccess: () => {
      invalidateCache();
    },
    onSuccessText: ["상태가 업데이트 되었습니다."],
  });

  const onChangeStatus = async (value: string) => {
    execute(value);
  };

  return (
    <Select defaultValue={defaultValue} onValueChange={onChangeStatus}>
      <SelectTrigger>
        <SelectValue placeholder="상태" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="processing">처리 중</SelectItem>
        <SelectItem value="delivering">배송 중</SelectItem>
        <SelectItem value="done">완료</SelectItem>
        <SelectItem value="canceled">취소</SelectItem>
      </SelectContent>
    </Select>
  );
}
