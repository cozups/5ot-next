import { z } from "zod/v4";

export const productFormSchema = z.object({
  name: z.string().trim().min(1, "이름을 반드시 입력해주세요."),
  brand: z.string().trim().min(1, "제조사를 반드시 입력해주세요."),
  price: z.string().trim().min(1, "가격을 반드시 입력해주세요."),
  description: z.string().trim().min(1, "제품 설명을 적어주세요."),
  category: z.string().trim().min(1, "카테고리를 지정해주세요."),
  sex: z.string().trim().min(1, "성별을 선택해주세요"),
  image: z.instanceof(File).refine((file) => file.size > 0, "이미지를 넣어주세요."),
});

export type productFormData = z.infer<typeof productFormSchema>;
