import { z } from "zod/v4";

export const reviewFormSchema = z.object({
  star: z.string("평점을 입력해주세요."),
  content: z.string().trim().min(1, "리뷰 내용을 입력해주세요."),
});

export type ReviewFormData = z.infer<typeof reviewFormSchema>;
