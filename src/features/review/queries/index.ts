import { mapErrors } from "@/lib/handle-errors";
import { ApiResponse, PaginationResponse } from "@/types/response";
import { Review } from "@/types/review";
import { SupabaseClient } from "@supabase/supabase-js";

type GetResponse = ApiResponse<null, Review[] | null>;
type GetPaginationResponse = PaginationResponse<Review[] | null>;

export async function getAllReviews(client: SupabaseClient, productId: string): Promise<GetResponse> {
  const { data, error } = await client
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
  client: SupabaseClient,
  product_id: string,
  options: { pageNum: number; itemsPerPage: number }
): Promise<GetPaginationResponse> {
  const from = (options.pageNum - 1) * options.itemsPerPage;
  const to = from + options.itemsPerPage - 1;

  const { data, count, error } = await client
    .from("reviews")
    .select(`*, products:product_id(*), profiles:user_id(*)`, {
      count: "exact",
    })
    .eq("product_id", product_id)
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

export async function getRecentReviews(client: SupabaseClient, length: number): Promise<GetResponse> {
  const { data, error } = await client
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
