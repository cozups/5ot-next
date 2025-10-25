"use server";

import { mapErrors } from "@/lib/handle-errors";
import { OrderFormData, orderFormSchema } from "@/lib/validations-schema/order";
import { Order, Purchase } from "@/types/orders";
import { ApiResponse, PaginationResponse } from "@/types/response";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type OrderFormState = ApiResponse<OrderFormData, Order[]>;
type GetPaginationResponse = PaginationResponse<Order[] | null>;

export async function createOrder(products: Purchase[], formData: FormData): Promise<OrderFormState> {
  const raw = {
    receiver: formData.get("receiver")?.toString() || "",
    phone: formData.get("phone")?.toString() || "",
    baseAddress: formData.get("baseAddress")?.toString() || "",
    detailAddress: formData.get("detailAddress")?.toString() || "",
    deliveryRequest: formData.get("deliveryRequest")?.toString() || "",
  };

  const result = orderFormSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: mapErrors(result.error),
      values: raw,
    };
  }

  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  const { error: insertError } = await supabase.from("orders").insert({
    user_id: authData.user?.id,
    products,
    status: "processing",
    address: raw.detailAddress ? raw.baseAddress + ", " + raw.detailAddress : raw.baseAddress,
    receiver: raw.receiver,
    phone: raw.phone,
    deliveryRequest: raw.deliveryRequest,
  });

  if (insertError) {
    return {
      success: false,
      errors: mapErrors(insertError),
      values: raw,
    };
  }

  return { success: true };
}

export async function deleteOrder(id: string): Promise<OrderFormState> {
  const supabase = await createClient();

  const { error } = await supabase.from("orders").delete().eq("id", id);

  if (error) {
    return {
      success: false,
      errors: mapErrors(error),
    };
  }

  revalidatePath("/admin/order");
  return {
    success: true,
  };
}

export async function updateOrderStatus(id: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("orders").update({ status }).eq("id", id);

  if (error) {
    return {
      success: false,
      errors: mapErrors(error),
    };
  }

  revalidatePath("/admin/order");
  return {
    success: true,
  };
}

export async function updateOrderData(id: string, formData: FormData): Promise<OrderFormState> {
  const raw = {
    receiver: formData.get("receiver")?.toString() || "",
    phone: formData.get("phone")?.toString() || "",
    baseAddress: formData.get("baseAddress")?.toString() || "",
    detailAddress: formData.get("detailAddress")?.toString() || "",
    deliveryRequest: formData.get("deliveryRequest")?.toString() || "",
  };

  const result = orderFormSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: mapErrors(result.error),
      values: raw,
    };
  }

  const supabase = await createClient();
  const { error: updateDataError } = await supabase
    .from("orders")
    .update({
      receiver: formData.get("receiver")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
      address: raw.detailAddress ? raw.baseAddress + ", " + raw.detailAddress : raw.baseAddress,
      deliveryRequest: formData.get("deliveryRequest")?.toString() || "",
    })
    .eq("id", id);

  if (updateDataError) {
    return {
      success: false,
      errors: mapErrors(updateDataError),
      values: raw,
    };
  }

  revalidatePath("/mypage");
  return { success: true };
}

export async function getOrdersByPagination(options?: {
  pageNum: number;
  itemsPerPage: number;
}): Promise<GetPaginationResponse> {
  const from = options ? (options.pageNum - 1) * options.itemsPerPage : 0;
  const to = options ? from + options.itemsPerPage - 1 : 10000;

  const supabase = await createClient();
  const { data, count, error } = await supabase
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
  userId: string,
  options?: { pageNum: number; itemsPerPage: number }
): Promise<GetPaginationResponse> {
  const from = options ? (options.pageNum - 1) * options.itemsPerPage : 0;
  const to = options ? from + options.itemsPerPage - 1 : 10000;

  const supabase = await createClient();
  const { data, error, count } = await supabase
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

export async function getOrderById(id: string): Promise<ApiResponse<null, Order | null>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("orders").select().eq("id", id).single();

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
