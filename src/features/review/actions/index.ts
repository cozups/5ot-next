"use server";

import { mapErrors } from "@/lib/handle-errors";
import { reviewFormSchema } from "@/lib/validations-schema/review";
import { Review } from "@/types/review";
import { ApiResponse } from "@/types/response";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type ReviewFormState = ApiResponse<null, Review[] | null>;

export async function createReview(productId: string, formData: FormData): Promise<ReviewFormState> {
  const raw = {
    star: formData.get("star")?.toString() || "",
    content: formData.get("content")?.toString() || "",
  };

  const result = reviewFormSchema.safeParse(raw);

  if (result.error) {
    return {
      success: false,
      errors: mapErrors(result.error),
    };
  }

  const supabase = await createClient();
  const { data: userData, error: userDataError } = await supabase.auth.getUser();

  if (userDataError) {
    return {
      success: false,
      errors: mapErrors(userDataError),
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
    };
  }

  revalidatePath("/");
  return { success: true };
}

export async function updateReview(id: string, formData: FormData): Promise<ReviewFormState> {
  const raw = {
    star: formData.get("star")?.toString() || "",
    content: formData.get("content")?.toString() || "",
  };

  const result = reviewFormSchema.safeParse(raw);

  if (result.error) {
    return {
      success: false,
      errors: mapErrors(result.error),
    };
  }

  const supabase = await createClient();

  const { error: updateError } = await supabase.from("reviews").update(raw).eq("id", id);

  if (updateError) {
    return {
      success: false,
      errors: mapErrors(updateError),
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
