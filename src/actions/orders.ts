'use server';

import { Order, Purchase } from '@/types/orders';
import { ApiResponse } from '@/types/response';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod/v4';

const orderFormSchema = z.object({
  receiver: z.string().trim().min(1, '받는 분의 이름을 작성해주세요.'),
  phone: z
    .string()
    .startsWith('010', '전화번호는 반드시 010으로 시작해야 합니다.')
    .length(11, '전화번호는 11자이어야 합니다.'),
  address: z.string().trim().min(1, '주소를 반드시 작성해주세요.'),
});

type OrderFormSchema = z.infer<typeof orderFormSchema>;
export type OrderFormState = ApiResponse<OrderFormSchema, Order>;

export async function createOrder(
  products: Purchase[],
  prevState: OrderFormState,
  formData: FormData
) {
  console.log(
    formData.get('base-address')?.toString(),
    formData.get('detail-address')?.toString()
  );
  const raw = {
    receiver: formData.get('receiver')?.toString() || '',
    phone: formData.get('phone')?.toString() || '',
    address:
      (formData.get('base-address')?.toString() || '') +
      ', ' +
      (formData.get('detail-address')?.toString() || ''),
    deliveryRequest: formData.get('deliveryRequest')?.toString() || '',
  };

  const result = orderFormSchema.safeParse(raw);

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
    status: 'processing',
    address: raw.address,
    receiver: raw.receiver,
    phone: raw.phone,
    deliveryRequest: raw.deliveryRequest,
  });

  if (insertError) {
    return {
      success: false,
      errors: { insertError: [insertError.message] },
      values: raw,
    };
  }

  return { success: true };
}

export async function deleteOrder(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('orders').delete().eq('id', id);

  if (error) {
    return {
      success: false,
      errors: {
        deleteError: [error.message],
      },
    };
  }

  revalidatePath('/admin/order');
  return {
    success: true,
  };
}

export async function updateOrderStatus(id: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);

  if (error) {
    return {
      success: false,
      errors: {
        updateError: [error.message],
      },
    };
  }

  revalidatePath('/admin/order');
  return {
    success: true,
  };
}

export async function updateOrderData(
  id: string,
  prevState: OrderFormState,
  formData: FormData
): Promise<OrderFormState> {
  const raw = {
    receiver: formData.get('receiver')?.toString() || '',
    phone: formData.get('phone')?.toString() || '',
    address:
      (formData.get('base-address')?.toString() || '') +
      ', ' +
      (formData.get('detail-address')?.toString() || ''),
    deliveryRequest: formData.get('deliveryRequest')?.toString() || '',
  };

  const result = orderFormSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
      values: raw,
    };
  }

  const supabase = await createClient();
  const { error: updateDataError } = await supabase
    .from('orders')
    .update(raw)
    .eq('id', id);

  if (updateDataError) {
    return {
      success: false,
      errors: {
        updateDataError: [updateDataError.message],
      },
      values: raw,
    };
  }

  revalidatePath('/mypage');
  return { success: true };
}

export async function getOrderById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('orders').select().eq('id', id);

  if (error) {
    return {
      success: false,
      errors: {
        getDataError: [error.message],
      },
    };
  }

  return {
    success: true,
    data,
  };
}
