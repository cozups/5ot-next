import { z } from "zod/v4";

export const productFormSchema = z.object({
  name: z.string().trim().min(1, "이름을 반드시 입력해주세요."),
  brand: z.string().trim().min(1, "제조사를 반드시 입력해주세요."),
  price: z.string().trim().min(1, "가격을 반드시 입력해주세요."),
  description: z.string().trim().min(1, "제품 설명을 적어주세요."),
  category: z.string("카테고리를 지정해주세요.").trim().min(1, "카테고리를 지정해주세요."),
  sex: z.string("성별을 선택해주세요").trim().min(1, "성별을 선택해주세요"),
  image: z
    .file("이미지를 넣어주세요.")
    .mime(["image/gif", "image/jpeg", "image/png", "image/webp"])
    .refine((file) => file.size <= 1024 * 1024, "1MB 이하의 이미지를 넣어주세요"),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
