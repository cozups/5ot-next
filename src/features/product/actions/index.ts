"use server";

import { revalidatePath } from "next/cache";

import { Category } from "@/types/category";
import { Products } from "@/types/products";
import { generateRandomId } from "@/lib/utils";
import { ApiResponse } from "@/types/response";
import { mapErrors } from "@/lib/handle-errors";
import { createClient } from "@/utils/supabase/server";
import { ProductFormData, productFormSchema as formSchema } from "@/lib/validations-schema/product";
import { getImageURL, removeImageFromStorage, uploadImageToStorage } from "@/actions/storage";
import { ErrorReturn } from "@/types/error";

export type ProductFormState = ApiResponse<ProductFormData, Products[] | null>;

export async function insertProduct(formData: FormData): Promise<ProductFormState> {
  const raw = {
    name: formData.get("name")?.toString() || "",
    brand: formData.get("brand")?.toString() || "",
    price: formData.get("price")?.toString() || "",
    image: formData.get("image") as File,
    description: formData.get("description")?.toString() || "",
    category: formData.get("category")?.toString() || "",
    sex: formData.get("sex")?.toString() || "",
  };

  const result = formSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: mapErrors(result.error),
      values: raw,
    };
  }

  // 이미지 업로드
  const fileName = `images/${generateRandomId()}.${raw.image.type.split("/")[1]}`;
  const { data, error } = await uploadImageToStorage("products", fileName, raw.image);

  if (error) {
    return {
      success: false,
      errors: mapErrors(error),
    };
  }

  // DB에 저장
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("category")
    .select()
    .eq("sex", raw.sex)
    .eq("name", raw.category)
    .overrideTypes<Category[]>();

  const { error: productUploadError } = await supabase.from("products").insert({
    name: raw.name,
    brand: raw.brand,
    price: Number(raw.price),
    description: raw.description,
    image: data.publicPath,
    category: `${raw.sex}/${raw.category}`,
    cat_id: category![0].id,
  });

  if (productUploadError) {
    return {
      success: false,
      errors: mapErrors(productUploadError),
    };
  }

  revalidatePath("/admin/product");
  return { success: true };
}

export async function deleteProduct(product: Products): Promise<{ success: boolean; errors?: ErrorReturn }> {
  const supabase = await createClient();

  // 이미지 삭제
  const imagePath = product.image?.split("/products/")[1];

  if (imagePath) {
    const { error } = await removeImageFromStorage("products", imagePath);

    if (error) {
      return {
        success: false,
        errors: mapErrors(error),
      };
    }
  }

  // 데이터 삭제
  const { error: deleteProductError } = await supabase.from("products").delete().eq("id", product.id);

  if (deleteProductError) {
    return {
      success: false,
      errors: mapErrors(deleteProductError),
    };
  }

  revalidatePath("/category");
  revalidatePath("/admin/product");
  return { success: true };
}

export async function updateProduct(
  originalData: Products,
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const raw = {
    name: formData.get("name")?.toString() || "",
    brand: formData.get("brand")?.toString() || "",
    price: formData.get("price")?.toString() || "",
    image: formData.get("image") as File,
    description: formData.get("description")?.toString() || "",
    category: formData.get("category")?.toString() || "",
    sex: formData.get("sex")?.toString() || "",
  };

  const result = formSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: mapErrors(result.error),
      values: raw,
    };
  }

  const supabase = await createClient();
  let updatedImagePath: string | undefined = undefined;

  // 이미지 업데이트
  if (raw.image?.size > 0) {
    const imagePath = originalData.image.split("/products/")[1];
    const { data, error: imageUpdateError } = await uploadImageToStorage("products", imagePath, raw.image, {
      upsert: true,
    });

    if (imageUpdateError) {
      return {
        success: false,
        errors: mapErrors(imageUpdateError),
      };
    }

    updatedImagePath = await getImageURL("products", data.publicPath);
  }

  // 카테고리 가져오기 - cat_id 업데이트 위함 (Supabase Functions로 개선 가능할 듯)
  const { data: category } = await supabase
    .from("category")
    .select()
    .eq("sex", raw.sex)
    .eq("name", raw.category)
    .overrideTypes<Category[]>();

  const dataToUpdate = {
    ...raw,
    category: `${raw.sex}/${raw.category}`,
    cat_id: category![0].id,
  };

  // 이미지가 변경되었을 때, 이미지 url도 같이 업데이트
  const isImageUploaded = updatedImagePath && updatedImagePath.length;
  const { error: productUpdateError } = await supabase
    .from("products")
    .update(isImageUploaded ? Object.assign(dataToUpdate, { image: updatedImagePath }) : dataToUpdate)
    .eq("id", originalData.id);

  if (productUpdateError) {
    return {
      success: false,
      errors: mapErrors(productUpdateError),
    };
  }

  revalidatePath("/category");
  revalidatePath("/admin/product");
  return { success: true };
}
