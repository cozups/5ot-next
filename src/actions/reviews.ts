import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export interface ReviewFormState {
  success: boolean;
  errors?: Record<string, string[]>;
}

export async function createReview(
  productId: string,
  prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const raw = {
    star: formData.get('star')?.toString() || '',
    content: formData.get('content')?.toString() || '',
  };

  if (!raw.content.trim().length) {
    return {
      success: false,
      errors: {
        content: ['리뷰 내용을 입력해주세요.'],
      },
    };
  }

  const supabase = await createClient();
  const { data: userData, error: userDataError } =
    await supabase.auth.getUser();

  if (userDataError) {
    return {
      success: false,
      errors: {
        content: ['유저 데이터를 불러오지 못했습니다.'],
      },
    };
  }

  const { error: insertError } = await supabase.from('reviews').insert({
    star: raw.star,
    content: raw.content,
    product_id: productId,
    user_id: userData.user.id,
  });

  if (insertError) {
    return {
      success: false,
      errors: {
        insertError: ['리뷰를 추가하지 못했습니다.'],
      },
    };
  }

  revalidatePath('/');
  return { success: true };
}

export async function updateReview(
  id: string,
  prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const raw = {
    star: formData.get('star')?.toString() || '',
    content: formData.get('content')?.toString() || '',
  };

  if (!raw.content.trim().length) {
    return {
      success: false,
      errors: {
        content: ['리뷰 내용을 입력해주세요.'],
      },
    };
  }

  const supabase = await createClient();

  const { error: updateError } = await supabase
    .from('reviews')
    .update(raw)
    .eq('id', id);

  if (updateError) {
    return {
      success: false,
      errors: {
        updateError: ['리뷰를 업데이트하지 못했습니다.'],
      },
    };
  }

  revalidatePath('/');
  return { success: true };
}

export async function deleteReview(id: string) {
  const supabase = await createClient();

  const { error: deleteError } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);

  if (deleteError) {
    throw new Error('리뷰를 삭제하지 못했습니다.');
  }

  revalidatePath('/');
}
