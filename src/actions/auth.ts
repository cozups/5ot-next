'use server';

import { z } from 'zod/v4';

const formSchema = z.object({
  username: z.string().trim().min(1, '이름을 반드시 입력해주세요.'),
  phoneNumber: z
    .string()
    .startsWith('010', '전화번호는 반드시 010으로 시작해야 합니다.')
    .length(11, '전화번호는 11자이어야 합니다.'),
  userEmail: z.email('올바른 이메일 형식을 작성해주세요.'),
  password: z.string().trim().min(6, '6자 이상의 암호를 입력해주세요.'),
});

export interface FormState {
  success: boolean;
  errors?: Record<string, string[]>;
  values?: z.infer<typeof formSchema>;
}

export async function createUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const raw = {
    username: formData.get('username')?.toString() || '',
    phoneNumber: formData.get('phoneNumber')?.toString() || '',
    userEmail: formData.get('userEmail')?.toString() || '',
    password: formData.get('password')?.toString() || '',
  };

  // TODO: 유효성 검사
  const result = formSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
      values: raw,
    };
  }

  // TODO: 데이터 전송 및 유저 가입

  // TODO: 리다이렉션
  return { success: true };
}
