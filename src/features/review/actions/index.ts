"use server";

import { mapErrors } from "@/lib/handle-errors";
import { reviewFormSchema } from "@/lib/validations-schema/review";
import { Review } from "@/types/products";
import { ApiResponse, PaginationResponse } from "@/types/response";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type ReviewFormState = ApiResponse<null, Review[] | null>;
type GetPaginationResponse = PaginationResponse<Review[] | null>;

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

  if (!raw.content.trim().length) {
    return {
      success: false,
      errors: {
        name: "validation",
        message: "리뷰 내용을 입력해주세요.",
      },
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

  revalidatePath("/");
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

  revalidatePath("/");
  return { success: true };
}

export async function getReviews(productId: string): Promise<ReviewFormState> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select(`*, products:product_id(*), profiles:user_id(*)`)
    .eq("product_id", productId)
    .overrideTypes<Review[]>();

  if (error) {
    return {
      success: false,
      errors: mapErrors(error),
    };
  }

  return {
    success: true,
    data,
  };
}

export async function getReviewsByPagination(
  query: string,
  options: { pageNum: number; itemsPerPage: number }
): Promise<GetPaginationResponse> {
  const from = (options.pageNum - 1) * options.itemsPerPage;
  const to = from + options.itemsPerPage - 1;

  const supabase = await createClient();
  const { data, count, error } = await supabase
    .from("reviews")
    .select(`*, products:product_id(*), profiles:user_id(*)`, {
      count: "exact",
    })
    .eq("product_id", query)
    .range(from, to)
    .overrideTypes<Review[]>();

  if (error) {
    return {
      success: false,
      errors: mapErrors(error),
      count: 0,
    };
  }

  return { success: true, data, count: count || 0 };
}

export async function getRecentReviews(length: number): Promise<ApiResponse<null, Review[] | null>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select(`*, products:product_id(*), profiles:user_id(*)`)
    .limit(length)
    .order("created_at", { ascending: true })
    .overrideTypes<Review[]>();

  if (error) {
    return {
      success: false,
      errors: mapErrors(error),
    };
  }

  return {
    success: true,
    data,
  };
}
