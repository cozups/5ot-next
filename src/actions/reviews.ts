'use server';

import { Review } from '@/types/products';
import { ApiResponse, PaginationResponse } from '@/types/response';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export type ReviewFormState = ApiResponse<null, Review[] | null>;

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
    star: Number(raw.star),
    content: raw.content,
    product_id: productId,
    user_id: userData.user.id,
  });

  if (insertError) {
    return {
      success: false,
      errors: {
        insertError: [insertError.message],
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
    return {
      success: false,
      errors: {
        deleteError: [deleteError.message],
      },
    };
  }

  revalidatePath('/');
  return { success: true };
}

export async function getReviews(productId: string): Promise<ReviewFormState> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('reviews')
    .select(`*, products:product_id(*), profiles:user_id(*)`)
    .eq('product_id', productId)
    .overrideTypes<Review[]>();

  return {
    success: true,
    data,
  };
}

export async function getReviewsByPagination(
  query: string,
  options: { pageNum: number; itemsPerPage: number }
): Promise<PaginationResponse<Review[]>> {
  const from = (options.pageNum - 1) * options.itemsPerPage;
  const to = from + options.itemsPerPage - 1;

  const supabase = await createClient();
  const { data, count, error } = await supabase
    .from('reviews')
    .select(`*, products:product_id(*), profiles:user_id(*)`, {
      count: 'exact',
    })
    .eq('product_id', query)
    .range(from, to);

  if (error) {
    return {
      success: false,
      errors: {
        getReviewsError: [error.message],
      },
    };
  }

  return { success: true, data, count: count || 0 };
}

export async function getRecentReviews(
  length: number
): Promise<ReviewFormState> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reviews')
    .select(`*, products:product_id(*), profiles:user_id(*)`)
    .limit(length)
    .order('created_at', { ascending: true })
    .overrideTypes<Review[]>();

  if (error) {
    return {
      success: false,
      errors: {
        getReviewsError: [error.message],
      },
    };
  }

  return {
    success: true,
    data,
  };
}
