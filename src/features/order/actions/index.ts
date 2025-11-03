"use server";

import { mapErrors } from "@/lib/handle-errors";
import { OrderFormData, orderFormSchema } from "@/lib/validations-schema/order";
import { Purchase } from "@/types/orders";
import { ApiResponse } from "@/types/response";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type OrderFormState = ApiResponse<OrderFormData, null>;

export async function createOrder(formData: FormData, products: Purchase[]): Promise<OrderFormState> {
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

  revalidatePath("/mypage");
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

export async function updateOrderData(formData: FormData, id: string): Promise<OrderFormState> {
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
  revalidatePath("/admin/order");
  return { success: true };
}
