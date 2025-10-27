import { mapErrors } from "@/lib/handle-errors";
import { Order } from "@/types/orders";
import { ApiResponse, PaginationResponse } from "@/types/response";
import { SupabaseClient } from "@supabase/supabase-js";

type GetPaginationResponse = PaginationResponse<Order[] | null>;

export async function getOrdersByPagination(
  client: SupabaseClient,
  options?: {
    pageNum: number;
    itemsPerPage: number;
  }
): Promise<GetPaginationResponse> {
  const from = options ? (options.pageNum - 1) * options.itemsPerPage : 0;
  const to = options ? from + options.itemsPerPage - 1 : 10000;

  const { data, count, error } = await client
    .from("orders")
    .select(`*, profiles:user_id (name)`, { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: true })
    .overrideTypes<Order[]>();

  if (error) {
    return {
      success: false,
      errors: mapErrors(error),
      count: 0,
    };
  }

  return {
    success: true,
    data,
    count: count || 0,
  };
}

export async function getOrdersByUserId(
  client: SupabaseClient,
  userId: string,
  options?: { pageNum: number; itemsPerPage: number }
): Promise<GetPaginationResponse> {
  const from = options ? (options.pageNum - 1) * options.itemsPerPage : 0;
  const to = options ? from + options.itemsPerPage - 1 : 10000;

  const { data, error, count } = await client
    .from("orders")
    .select(`*, profiles:user_id (name)`, { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: true })
    .eq("user_id", userId);

  if (error) {
    return {
      success: false,
      errors: mapErrors(error),
      count: 0,
    };
  }

  return {
    success: true,
    data,
    count: count || 0,
  };
}

export async function getOrderById(client: SupabaseClient, id: string): Promise<ApiResponse<null, Order | null>> {
  const { data, error } = await client.from("orders").select().eq("id", id).single();

  if (error) {
    return {
      success: false,
      errors: mapErrors(error),
      data: null,
    };
  }

  return {
    success: true,
    data,
  };
}
