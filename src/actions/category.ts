'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createCategory(formData: FormData) {
  const name = (formData.get('categoryName') as string) || '';
  const sex = (formData.get('categorySex') as string) || '';

  if (name.trim().length <= 0) {
    throw new Error('카테고리 이름을 제대로 입력해주세요.');
  }

  if (sex.length === 0) {
    throw new Error('카테고리 성별을 골라주세요.');
  }
  const supabase = await createClient();

  const { error } = await supabase.from('category').insert({ name, sex });

  if (error) {
    throw new Error('카테고리 생성에 실패했습니다.');
  }

  revalidatePath('/admin/category');
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('category').delete().eq('id', id);

  if (error) {
    throw new Error('카테고리 삭제에 실패했습니다.');
  }

  // TODO: 카테고리에 엮인 옷들 삭제

  revalidatePath('/admin/category');
}
