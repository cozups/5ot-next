"use server";

import { mapErrors } from "@/lib/handle-errors";
import { ReviewFormData, reviewFormSchema } from "@/lib/validations-schema/review";
import { ApiResponse } from "@/types/response";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type ReviewFormState = ApiResponse<ReviewFormData, null>;

export async function createReview(formData: FormData, productId: string): Promise<ReviewFormState> {
  const raw = {
    star: formData.get("star")?.toString() || "",
    content: formData.get("content")?.toString() || "",
  };

  const result = reviewFormSchema.safeParse(raw);

  if (result.error) {
    return {
      success: false,
      errors: mapErrors(result.error),
      values: raw,
    };
  }

  const supabase = await createClient();
  const { data: userData, error: userDataError } = await supabase.auth.getUser();

  if (userDataError) {
    return {
      success: false,
      errors: mapErrors(userDataError),
      values: raw,
    };
  }

  const { error: insertError } = await supabase.from("reviews").insert({
    star: Number(raw.star),
    content: raw.content,
    product_id: productId,
    user_id: userData.user.id,
  });

  if (insertError) {
    return {
      success: false,
      errors: mapErrors(insertError),
      values: raw,
    };
  }

  revalidatePath("/");
  return { success: true };
}

export async function updateReview(formData: FormData, id: string): Promise<ReviewFormState> {
  const raw = {
    star: formData.get("star")?.toString() || "",
    content: formData.get("content")?.toString() || "",
  };

  const result = reviewFormSchema.safeParse(raw);

  if (result.error) {
    return {
      success: false,
      errors: mapErrors(result.error),
      values: raw,
    };
  }

  const supabase = await createClient();

  const { error: updateError } = await supabase.from("reviews").update(raw).eq("id", id);

  if (updateError) {
    return {
      success: false,
      errors: mapErrors(updateError),
      values: raw,
    };
  }

  revalidatePath("/product");
  return { success: true };
}

export async function deleteReview(id: string) {
  const supabase = await createClient();

  const { error: deleteError } = await supabase.from("reviews").delete().eq("id", id);

  if (deleteError) {
    return {
      success: false,
      errors: mapErrors(deleteError),
    };
  }

  revalidatePath("/product");
  return { success: true };
}
