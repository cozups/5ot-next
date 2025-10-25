import { z } from "zod/v4";

export const orderFormSchema = z.object({
  receiver: z.string("받는 분의 이름을 작성해주세요.").trim().min(1, "받는 분의 이름을 작성해주세요."),
  phone: z
    .string()
    .startsWith("010", "전화번호는 반드시 010으로 시작해야 합니다.")
    .length(11, "전화번호는 11자이어야 합니다."),
  baseAddress: z.string("정확한 주소를 반드시 작성해주세요.").trim().min(1, "정확한 주소를 반드시 작성해주세요."),
  detailAddress: z.string().trim().optional(),
  deliveryRequest: z.string().trim().optional(),
});

export type OrderFormData = z.infer<typeof orderFormSchema>;
