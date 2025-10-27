import { mapErrors } from "@/lib/handle-errors";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getUser(client: SupabaseClient) {
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error) {
    return {
      success: false,
      errors: mapErrors(error),
    };
  }

  return { success: true, data: user };
}

export async function getUserList(client: SupabaseClient) {
  const { data, error } = await client.auth.admin.listUsers();

  if (error) {
    return {
      success: false,
      errors: mapErrors(error),
    };
  }

  return { success: false, data };
}
