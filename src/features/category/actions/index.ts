"use server";

import { revalidatePath } from "next/cache";

import { ApiResponse } from "@/types/response";
import { mapErrors } from "@/lib/handle-errors";
import { createClient } from "@/utils/supabase/server";
import { CategoryFormData, categoryFormSchema } from "@/lib/validations-schema/category";
import { Category } from "@/types/category";

export type CategoryFormState = ApiResponse<CategoryFormData, null>;

export async function createCategory(prevState: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  const raw = {
    name: (formData.get("categoryName") as string) || "",
    sex: (formData.get("categorySex") as string) || "",
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
