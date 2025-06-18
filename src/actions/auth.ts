'use server';

import { supabaseAdmin } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { z } from 'zod/v4';

const joinFormSchema = z.object({
  username: z.string().trim().min(1, '이름을 반드시 입력해주세요.'),
  phoneNumber: z
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

export interface FormState {
  success: boolean;
  errors?: Record<string, string[]>;
}

export interface JoinFormState extends FormState {
  values?: z.infer<typeof joinFormSchema>;
}

export interface LoginFormState extends FormState {
  values?: z.infer<typeof loginFormSchema>;
}

export async function createUser(
  prevState: JoinFormState,
  formData: FormData
): Promise<JoinFormState> {
  const raw = {
    username: formData.get('username')?.toString() || '',
    phoneNumber: formData.get('phoneNumber')?.toString() || '',
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

  await supabase.auth.signUp({
    email: raw.userEmail,
    password: raw.password,
    phone: raw.phoneNumber,
    options: {
      data: {
        username: raw.username,
        role: 'normal',
      },
    },
  });

  // 리다이렉션
  redirect('/');
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

  const { error } = await supabase.auth.signInWithPassword({
    email: raw.userEmail,
    password: raw.password,
  });

  if (error) {
    const errorMessage =
      error.code === 'invalid_credentials'
        ? 'ID 혹은 패스워드가 일치하지 않습니다.'
        : '로그인에 실패했습니다.';
    return {
      success: false,
      errors: { result: [errorMessage] },
      values: raw,
    };
  }

  // 리다이렉트
  redirect('/');
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  redirect('/');
}

export async function deleteUser(id: string) {
  const supabase = await createClient();

  const { error: logoutError } = await supabase.auth.signOut();

  if (logoutError) {
    throw new Error(logoutError.message);
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (error) {
    throw new Error('회원 탈퇴에 실패했습니다.');
  }

  redirect('/');
}
