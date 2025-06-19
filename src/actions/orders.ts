'use server';

import { Purchase } from '@/types/orders';
import { createClient } from '@/utils/supabase/server';
import { z } from 'zod/v4';

const formSchema = z.object({
  receiver: z.string().trim().min(1, '받는 분의 이름을 작성해주세요.'),
  phoneNumber: z
    .string()
    .startsWith('010', '전화번호는 반드시 010으로 시작해야 합니다.')
    .length(11, '전화번호는 11자이어야 합니다.'),
  address: z.string().trim().min(1, '주소를 반드시 작성해주세요.'),
});

export interface FormState {
  success: boolean;
  errors?: Record<string, string[]>;
  values?: z.infer<typeof formSchema>;
}

export async function createOrder(
  products: Purchase[],
  prevState: FormState,
  formData: FormData
) {
  const raw = {
    receiver: formData.get('receiver')?.toString() || '',
    phoneNumber: formData.get('phoneNumber')?.toString() || '',
    address: formData.get('address')?.toString() || '',
    deliveryRequest: formData.get('deliveryRequest')?.toString() || '',
  };

  const result = formSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
      values: raw,
    };
  }

  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  const { error: insertError } = await supabase.from('orders').insert({
    user_id: authData.user?.id,
    products,
    status: '처리 중',
    address: raw.address,
    receiver: raw.receiver,
    phoneNumber: raw.phoneNumber,
    deliveryRequest: raw.deliveryRequest,
  });

  if (insertError) {
    return {
      success: false,
      errors: { insertError: ['데이터 전송에 실패했습니다.'] },
      values: raw,
    };
  }

  return { success: true };
}
