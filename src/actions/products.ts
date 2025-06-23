'use server';

import { Products } from '@/types/products';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod/v4';
import { generateRandomId } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().trim().min(1, '이름을 반드시 입력해주세요.'),
  brand: z.string().trim().min(1, '제조사를 반드시 입력해주세요.'),
  price: z.string().trim().min(1, '가격을 반드시 입력해주세요.'),
  description: z.string().trim().min(1, '제품 설명을 적어주세요.'),
  category: z.string().trim().min(1, '카테고리를 지정해주세요.'),
  sex: z.string().trim().min(1, '성별을 선택해주세요'),
});

export interface FormState {
  success: boolean;
  errors?: Record<string, string[]>;
  values?: {
    name: string;
    brand: string;
    price: string;
    category: string;
    sex: string;
    description: string;
  };
}

export interface ReviewFormState {
  success: boolean;
  errors?: Record<string, string[]>;
}

export async function addProduct(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = {
    name: formData.get('name')?.toString() || '',
    brand: formData.get('brand')?.toString() || '',
    price: formData.get('price')?.toString() || '',
    image: formData.get('image') as File,
    description: formData.get('description')?.toString() || '',
    category: formData.get('category')?.toString() || '',
    sex: formData.get('sex')?.toString() || '',
  };

  const result = formSchema.safeParse(raw);
  let errors: Record<string, string[]> = {};

  if (raw.image.size === 0) {
    errors.image = ['이미지를 넣어주세요.'];
  }

  if (!result.success) {
    errors = Object.assign(errors, z.flattenError(result.error).fieldErrors);

    return {
      success: false,
      errors,
      values: {
        name: raw.name,
        brand: raw.brand,
        price: raw.price,
        description: raw.description,
        category: raw.category,
        sex: raw.sex,
      },
    };
  }

  // 이미지 업로드
  const supabase = await createClient();
  const imageName = `images/${generateRandomId()}.${
    raw.image.type.split('/')[1]
  }`;

  const { data, error } = await supabase.storage
    .from('products')
    .upload(imageName, raw.image);

  if (error) {
    return {
      success: false,
      errors: {
        imageUpload: ['이미지 업로드에 실패했습니다.'],
      },
    };
  }

  const { data: uploadedPath } = supabase.storage
    .from('products')
    .getPublicUrl(data.path);

  // DB에 저장
  const { error: productUploadError } = await supabase.from('products').insert({
    name: raw.name,
    brand: raw.brand,
    price: raw.price,
    image: uploadedPath.publicUrl,
    category: `${raw.sex}/${raw.category}`,
    description: raw.description,
  });

  if (productUploadError) {
    return {
      success: false,
      errors: {
        insertError: ['제품을 업로드 하지 못했습니다.'],
      },
    };
  }

  revalidatePath('/admin/product');
  return { success: true };
}

export async function deleteProduct(product: Products) {
  const supabase = await createClient();

  // 이미지 삭제
  const filePath = product.image?.split('/products/')[1];

  if (filePath) {
    const { error: deleteImageError } = await supabase.storage
      .from('products')
      .remove([filePath]);

    if (deleteImageError) {
      throw new Error('이미지 삭제에 실패했습니다.');
    }
  }

  // 데이터 삭제
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', product.id);

  if (error) {
    throw new Error('데이터 삭제에 실패했습니다.');
  }

  revalidatePath('/admin/product');
}

export async function updateProduct(
  originalData: Products,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = {
    name: formData.get('name')?.toString() || '',
    brand: formData.get('brand')?.toString() || '',
    price: formData.get('price')?.toString() || '',
    image: formData.get('image') as File,
    description: formData.get('description')?.toString() || '',
    category: formData.get('category')?.toString() || '',
    sex: formData.get('sex')?.toString() || '',
  };

  const result = formSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
      values: {
        name: raw.name,
        brand: raw.brand,
        price: raw.price,
        description: raw.description,
        category: raw.category,
        sex: raw.sex,
      },
    };
  }

  const supabase = await createClient();
  let updatedImagePath = '';

  if (raw.image?.size > 0) {
    const filePath = originalData.image.split('/products/')[1];
    const { data, error } = await supabase.storage
      .from('products')
      .update(filePath, raw.image, {
        upsert: true,
      });

    if (error) {
      return {
        success: false,
        errors: {
          imageUpdate: ['이미지 업데이트에 실패했습니다.'],
        },
      };
    }

    updatedImagePath = supabase.storage.from('products').getPublicUrl(data.path)
      .data.publicUrl;
  }

  const dataToUpdate = {
    name: raw.name,
    brand: raw.brand,
    price: raw.price,
    category: `${raw.sex}/${raw.category}`,
    description: raw.description,
  };
  const { error: productUpdateError } = await supabase
    .from('products')
    .update(
      updatedImagePath.length > 0
        ? Object.assign(dataToUpdate, { image: updatedImagePath })
        : dataToUpdate
    )
    .eq('id', originalData.id);

  if (productUpdateError) {
    return {
      success: false,
      errors: {
        updateError: ['제품을 업데이트 하지 못했습니다.'],
      },
    };
  }

  revalidatePath('/admin/product');
  return { success: true };
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

  return { success: true };
}
