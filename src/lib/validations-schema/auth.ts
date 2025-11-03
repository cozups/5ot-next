import { z } from "zod/v4";

export const joinFormSchema = z.object({
  username: z.string().trim().min(1, "이름을 반드시 입력해주세요."),
  phone: z
    .string()
    .startsWith("010", "전화번호는 반드시 010으로 시작해야 합니다.")
    .length(11, "전화번호는 11자이어야 합니다."),
  userEmail: z.email("올바른 이메일 형식을 작성해주세요."),
  password: z.string().trim().min(6, "6자 이상의 암호를 입력해주세요."),
});

export type JoinFormData = z.infer<typeof joinFormSchema>;

export const loginFormSchema = z.object({
  userEmail: z.email("올바른 이메일 형식을 작성해주세요."),
  password: z.string().trim().min(6, "6자 이상의 암호를 입력해주세요."),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

export const updateProfileFormSchema = z.object({
  username: z.string().trim().min(1, "이름을 반드시 입력해주세요."),
  image: z
    .any()
    .optional()
    .refine(
      (file) => !file || file.size <= 1024 * 1024, // 파일이 없거나, 1MB 이하인 경우만 통과
      "1MB 이하의 이미지를 넣어주세요"
    )
    .refine(
      (file) => !file || ["image/gif", "image/jpeg", "image/png", "image/webp"].includes(file.type),
      "지원하지 않는 이미지 형식입니다."
    ),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileFormSchema>;
