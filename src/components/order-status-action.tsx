'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function OrderStatusAction({
  defaultValue,
  action,
}: {
  defaultValue: string;
  action: (id: string) => Promise<void>;
}) {
  const onChangeStatus = async (value: string) => {
    await action(value);
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
