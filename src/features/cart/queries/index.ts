import { mapErrors } from "@/lib/handle-errors";
import { Cart } from "@/types/cart";
import { ErrorReturn } from "@/types/error";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getCartDataFromDB(
  client: SupabaseClient,
  userId: string
): Promise<{ success: boolean; data: Cart[]; errors?: ErrorReturn }> {
  const { data, error } = await client.from("profiles").select("cart").eq("id", userId).overrideTypes<Cart[]>();

  if (error) {
    return {
      success: false,
      data: [],
      errors: mapErrors(error),
    };
  }

  return { success: true, data: data?.[0].cart || [] };
}
