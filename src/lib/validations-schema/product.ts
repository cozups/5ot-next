import { z } from "zod/v4";

export const productFormSchema = z.object({
  name: z.string().trim().min(1, "이름을 반드시 입력해주세요."),
  brand: z.string().trim().min(1, "제조사를 반드시 입력해주세요."),
  price: z.string().trim().min(1, "가격을 반드시 입력해주세요."),
  description: z.string().trim().min(1, "제품 설명을 적어주세요."),
  category: z.string("카테고리를 지정해주세요.").trim().min(1, "카테고리를 지정해주세요."),
  sex: z.string("성별을 선택해주세요").trim().min(1, "성별을 선택해주세요"),
  image: z.file("이미지를 넣어주세요.").refine((file) => file.size <= 1024 * 1024, "1MB 이하의 이미지를 넣어주세요"),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

export const updateProductFormSchema = z.object({
  name: z.string().trim().min(1, "이름을 반드시 입력해주세요."),
  brand: z.string().trim().min(1, "제조사를 반드시 입력해주세요."),
  price: z.string().trim().min(1, "가격을 반드시 입력해주세요."),
  description: z.string().trim().min(1, "제품 설명을 적어주세요."),
  category: z.string("카테고리를 지정해주세요.").trim().min(1, "카테고리를 지정해주세요."),
  sex: z.string("성별을 선택해주세요").trim().min(1, "성별을 선택해주세요"),
  image: z
    .union([
      z
        .instanceof(File)
        .refine((file) => file.size <= 1024 * 1024, "1MB 이하의 이미지를 넣어주세요")
        .refine(
          (file) => ["image/gif", "image/jpeg", "image/png", "image/webp"].includes(file.type),
          "지원되는 이미지 형식이 아닙니다"
        ),
      z.string(), // 기존 URL이나 Base64 문자열 허용
    ])
    .optional(), // 선택 사항으로
});

export type UpdateProductFormData = z.infer<typeof updateProductFormSchema>;
