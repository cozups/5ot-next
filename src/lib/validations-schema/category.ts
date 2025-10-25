import { z } from "zod/v4";

export const categoryFormSchema = z.object({
  name: z.string().trim().min(1, "카테고리 이름을 적어주세요."),
  sex: z.string().trim().min(1, "카테고리 성별을 골라주세요."),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
