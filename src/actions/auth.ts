'use server';

import { ApiResponse } from '@/types/response';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { User } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { z } from 'zod/v4';

const joinFormSchema = z.object({
  username: z.string().trim().min(1, '이름을 반드시 입력해주세요.'),
  phone: z
    .string()
    .startsWith('010', '전화번호는 반드시 010으로 시작해야 합니다.')
    .length(11, '전화번호는 11자이어야 합니다.'),
  userEmail: z.email('올바른 이메일 형식을 작성해주세요.'),
  password: z.string().trim().min(6, '6자 이상의 암호를 입력해주세요.'),
});

const loginFormSchema = z.object({
  userEmail: z.email('올바른 이메일 형식을 작성해주세요.'),
  password: z.string().trim().min(6, '6자 이상의 암호를 입력해주세요.'),
});

export type JoinFormState = ApiResponse<typeof joinFormSchema, null>;

export type LoginFormState = ApiResponse<typeof loginFormSchema, null>;

export type UpdateFormState = ApiResponse<
  {
    username: string;
    image: File;
  },
  null
>;

export async function createUser(
  prevState: JoinFormState,
  formData: FormData
): Promise<JoinFormState> {
  const raw = {
    username: formData.get('username')?.toString() || '',
    phone: formData.get('phone')?.toString() || '',
    userEmail: formData.get('userEmail')?.toString() || '',
    password: formData.get('password')?.toString() || '',
  };

  // 유효성 검사
  const result = joinFormSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
      values: raw,
    };
  }

  // 데이터 전송 및 유저 가입
  const supabase = await createClient();

  const { error: signUpError } = await supabase.auth.signUp({
    email: raw.userEmail,
    password: raw.password,
    phone: raw.phone,
    options: {
      data: {
        username: raw.username,
        role: 'normal',
        image: '',
        phone: raw.phone,
      },
    },
  });

  if (signUpError) {
    return {
      success: false,
      errors: {
        signUpError: [signUpError.message],
      },
      values: raw,
    };
  }

  return {
    success: true,
  };
}

export async function loginUser(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const raw = {
    userEmail: formData.get('userEmail')?.toString() || '',
    password: formData.get('password')?.toString() || '',
  };

  // 유효성 검사
  const result = loginFormSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
      values: raw,
    };
  }

  // 로그인 요청
  const supabase = await createClient();

  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: raw.userEmail,
    password: raw.password,
  });

  if (loginError) {
    const errorMessage =
      loginError.code === 'invalid_credentials'
        ? 'ID 혹은 패스워드가 일치하지 않습니다.'
        : '로그인에 실패했습니다.';
    return {
      success: false,
      errors: { loginError: [errorMessage] },
      values: raw,
    };
  }

  return {
    success: true,
  };
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      success: false,
      errors: {
        logoutError: [error.message],
      },
    };
  }

  return {
    success: true,
  };
}

export async function deleteUser(user: User) {
  const supabase = await createClient();

  const { error: deleterUserError } = await supabaseAdmin.auth.admin.deleteUser(
    user.id
  );

  if (deleterUserError) {
    return {
      success: false,
      errors: {
        deleteUserError: [deleterUserError.message],
      },
    };
  }

  // 유저의 프로필 이미지를 스토리지에서 삭제
  const image = user.user_metadata.image;
  if (image) {
    const path = image.split('/public/profile/')[1];
    const { error: deleteImageError } = await supabase.storage
      .from('profile')
      .remove(path);

    if (deleteImageError) {
      return {
        success: false,
        errors: {
          deleteImageError: [deleteImageError.message],
        },
      };
    }
  }

  // 로그인 세션 삭제
  await logout();
  return {
    success: true,
  };
}

export async function updateUser(
  user: User,
  prevState: UpdateFormState,
  formData: FormData
): Promise<UpdateFormState> {
  const raw = {
    username: formData.get('username')?.toString() || '',
    image: formData.get('image') as File,
  };

  if (raw.username.trim().length < 1) {
    return {
      success: false,
      errors: {
        username: ['이름을 반드시 입력해주세요'],
      },
    };
  }

  const supabase = await createClient();
  const dataToUpdate: { username: string; image?: string } = {
    username: raw.username,
  };
  if (raw.image.size > 0) {
    // 이미지 저장 or 기존 이미지 대체
    const extension = raw.image.type.split('/')[1];
    const filename = `images/user${user.id.split('-')[0]}.${extension}`;

    // 이전 이미지와 새로운 이미지의 확장자가 다른 경우, 이전 이미지를 삭제 해야함
    const oldImage = user.user_metadata.image;
    const oldImageExtension = oldImage ? oldImage.split('.')[1] : null;

    if (oldImageExtension !== extension) {
      const path = oldImage.split('/public/profile/')[1];
      const { error: deleteImageError } = await supabase.storage
        .from('profile')
        .remove(path);

      if (deleteImageError) {
        return {
          success: false,
          errors: {
            deleteImageError: [deleteImageError.message],
          },
        };
      }
    }

    // 이미지 업데이트
    const { data: uploadedImage, error: imageUpdateError } =
      await supabase.storage
        .from('profile')
        .update(filename, raw.image, { upsert: true });

    if (imageUpdateError) {
      return {
        success: false,
        errors: {
          imageUpdateError: [imageUpdateError.message],
        },
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('profile').getPublicUrl(uploadedImage.path);
    dataToUpdate.image = publicUrl;
  }

  // 데이터 수정
  const { error: dataUpdateError } = await supabase.auth.updateUser({
    data: dataToUpdate,
  });

  if (dataUpdateError) {
    return {
      success: false,
      errors: {
        dataUpdateError: [dataUpdateError.message],
      },
    };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}
