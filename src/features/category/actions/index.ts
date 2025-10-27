"use server";

import { revalidatePath } from "next/cache";

import { ApiResponse } from "@/types/response";
import { mapErrors } from "@/lib/handle-errors";
import { createClient } from "@/utils/supabase/server";
import { CategoryFormData, categoryFormSchema } from "@/lib/validations-schema/category";
import { Category } from "@/types/category";
import { SupabaseClient } from "@supabase/supabase-js";

export type CategoryFormState = ApiResponse<CategoryFormData, null>;

export async function createCategory(formData: FormData): Promise<CategoryFormState> {
  const raw = {
    name: (formData.get("name") as string) || "",
    sex: (formData.get("sex") as string) || "",
  };

  const result = categoryFormSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: mapErrors(result.error),
      values: raw,
    };
  }

  const supabase = await createClient();

  const { error: insertError } = await supabase.from("category").insert({ name: raw.name, sex: raw.sex });

  if (insertError) {
    return {
      success: false,
      errors: mapErrors(insertError),
    };
  }

  revalidatePath("/admin/category");
  return { success: true, values: { name: "", sex: "" } };
}

export async function deleteCategory(id: string): Promise<CategoryFormState> {
  const supabase = await createClient();

  const { error: deleteError } = await supabase.from("category").delete().eq("id", id);

  if (deleteError) {
    return {
      success: false,
      errors: mapErrors(deleteError),
    };
  }

  revalidatePath("/admin/category");
  return {
    success: true,
  };
}

export async function getCategory(client: SupabaseClient, id: string): Promise<ApiResponse<null, Category | null>> {
  const { data, error } = await client.from("category").select().eq("id", id).maybeSingle<Category>();

  if (error) {
    return {
      success: false,
      errors: mapErrors(error),
    };
  }

  return { success: true, data };
}

export async function getCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("category").select("*").order("created_at", { ascending: false });

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

export async function getCategoriesBySex(sex: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("category").select().eq("sex", sex).overrideTypes<Category[]>();

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
