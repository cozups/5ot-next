import { mapErrors } from "@/lib/handle-errors";
import { ErrorReturn } from "@/types/error";
import { Products, RecentProducts } from "@/types/products";
import { ApiResponse, PaginationResponse } from "@/types/response";
import { SupabaseClient } from "@supabase/supabase-js";

// 검색할 때 사용
type GetResponse = ApiResponse<null, Products[] | null>;
type GetPaginationResponse = PaginationResponse<Products[] | null>;

export async function getProductByName(client: SupabaseClient, name: string): Promise<GetResponse> {
  const { data, error } = await client.rpc("search_product_by_compact_name", {
    search_text: name.trim(),
  });

  if (error) {
    return {
      success: false,
      errors: mapErrors(error),
    };
  }

  return { success: true, data };
}

// 제품 리스트를 페이지네이션하여 반환
export async function getProductsByPagination(
  client: SupabaseClient,
  categoryId: string,
  options: { pageNum: number; itemsPerPage: number }
): Promise<GetPaginationResponse> {
  const from = (options.pageNum - 1) * options.itemsPerPage;
  const to = from + options.itemsPerPage - 1;

  const { data, count, error } = await client
    .from("products")
    .select("*", { count: "exact" })
    .eq("cat_id", categoryId)
    .order("created_at", { ascending: true })
    .range(from, to)
    .overrideTypes<Products[]>();

  if (error) {
    return {
      success: false,
      data: null,
      count: 0,
      errors: mapErrors(error),
    };
  }

  return { success: true, data, count: count || 0 };
}

export async function getAllProductsByPagination(
  client: SupabaseClient,
  options: {
    pageNum: number;
    itemsPerPage: number;
  }
): Promise<GetPaginationResponse> {
  const from = (options.pageNum - 1) * options.itemsPerPage;
  const to = from + options.itemsPerPage - 1;

  const { data, count, error } = await client
    .from("products")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: true })
    .range(from, to)
    .overrideTypes<Products[]>();

  if (error) {
    return {
      success: false,
      data: null,
      count: 0,
      errors: mapErrors(error),
    };
  }

  return { success: true, data, count: count || 0 };
}

export async function getProductById(client: SupabaseClient, id: string): Promise<ApiResponse<null, Products | null>> {
  const { data, error } = await client.from("products").select().eq("id", id).limit(1).maybeSingle<Products>();

  if (error) {
    return {
      success: false,
      errors: mapErrors(error),
      data: null,
    };
  }

  return {
    success: true,
    data: data || null,
  };
}

export async function getRecentViewedProducts(
  client: SupabaseClient,
  userId: string
): Promise<{ success: boolean; data: RecentProducts[] | null; errors?: ErrorReturn }> {
  const { data, error } = await client.from("profiles").select("recent_viewed_products").eq("id", userId).single();

  if (error) {
    return {
      success: false,
      errors: mapErrors(error),
      data: null,
    };
  }

  return {
    success: true,
    data: data?.recent_viewed_products || [],
  };
}
