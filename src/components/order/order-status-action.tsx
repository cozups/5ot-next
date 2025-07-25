'use client';

import { OrderFormState } from '@/actions/orders';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toastError } from '@/lib/utils';
import { toast } from 'sonner';

export default function OrderStatusAction({
  defaultValue,
  action,
}: {
  defaultValue: string;
  action: (id: string) => Promise<OrderFormState>;
}) {
  const onChangeStatus = async (value: string) => {
    const result = await action(value);

    if (result.success) {
      toast.success('상태가 업데이트 되었습니다.');
    }

    if (result.errors) {
      toastError('상태 업데이트 중 문제가 발생했습니다.', result.errors);
    }
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
