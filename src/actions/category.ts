'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod/v4';

const categoryFormSchema = z.object({
  name: z.string().trim().min(1, '카테고리 이름을 적어주세요.'),
  sex: z.string().trim().min(1, '카테고리 성별을 골라주세요.'),
});

export interface FormState {
  success: boolean;
  errors?: Record<string, string[]>;
  values?: z.infer<typeof categoryFormSchema>;
}

export async function createCategory(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = {
    name: (formData.get('categoryName') as string) || '',
    sex: (formData.get('categorySex') as string) || '',
  };

  const result = categoryFormSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
      values: raw,
    };
  }

  const supabase = await createClient();

  const { error: insertError } = await supabase
    .from('category')
    .insert({ name: raw.name, sex: raw.sex });

  if (insertError) {
    return {
      success: false,
      errors: {
        insertError: [insertError.message],
      },
    };
  }

  revalidatePath('/admin/category');
  return { success: true };
}

export async function deleteCategory(
  id: string
): Promise<{ success: boolean; errors?: Record<string, string[]> }> {
  const supabase = await createClient();

  const { error: deleteError } = await supabase
    .from('category')
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

  revalidatePath('/admin/category');
  return {
    success: true,
  };
}
