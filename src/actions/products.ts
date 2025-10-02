"use server";

import { Products } from "@/types/products";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { generateRandomId } from "@/lib/utils";
import { Category } from "@/types/category";
import { ApiResponse } from "@/types/response";

const formSchema = z.object({
  name: z.string().trim().min(1, "이름을 반드시 입력해주세요."),
  brand: z.string().trim().min(1, "제조사를 반드시 입력해주세요."),
  price: z.string().trim().min(1, "가격을 반드시 입력해주세요."),
  description: z.string().trim().min(1, "제품 설명을 적어주세요."),
  category: z.string().trim().min(1, "카테고리를 지정해주세요."),
  sex: z.string().trim().min(1, "성별을 선택해주세요"),
  image: z.instanceof(File).refine((file) => file.size > 0, "이미지를 넣어주세요."),
});

export type ProductFormState = ApiResponse<typeof formSchema, Products[] | null>;

export async function insertProduct(prevState: ProductFormState, formData: FormData): Promise<ProductFormState> {
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
      errors: z.flattenError(result.error).fieldErrors,
      values: {
        name: raw.name,
        brand: raw.brand,
        price: raw.price,
        image: raw.image,
        description: raw.description,
        category: raw.category,
        sex: raw.sex,
      },
    };
  }

  // 이미지 업로드
  const supabase = await createClient();
  const imageName = `images/${generateRandomId()}.${raw.image.type.split("/")[1]}`;

  const { data, error } = await supabase.storage.from("products").upload(imageName, raw.image);

  if (error) {
    return {
      success: false,
      errors: {
        imageUpload: ["이미지 업로드에 실패했습니다."],
      },
    };
  }

  const { data: uploadedPath } = supabase.storage.from("products").getPublicUrl(data.path);

  // DB에 저장
  const { data: category } = await supabase
    .from("category")
    .select()
    .eq("sex", raw.sex)
    .eq("name", raw.category)
    .overrideTypes<Category[]>();

  const { error: productUploadError } = await supabase.from("products").insert({
    name: raw.name,
    brand: raw.brand,
    price: raw.price,
    image: uploadedPath.publicUrl,
    category: `${raw.sex}/${raw.category}`,
    description: raw.description,
    cat_id: category![0].id,
  });

  if (productUploadError) {
    return {
      success: false,
      errors: {
        insertError: ["제품을 업로드 하지 못했습니다."],
      },
    };
  }

  revalidatePath("/admin/product");
  return { success: true };
}

export async function deleteProduct(
  product: Products
): Promise<{ success: boolean; errors?: Record<string, string[]> }> {
  const supabase = await createClient();

  // 이미지 삭제
  const filePath = product.image?.split("/products/")[1];

  if (filePath) {
    const { error: deleteImageError } = await supabase.storage.from("products").remove([filePath]);

    if (deleteImageError) {
      return {
        success: false,
        errors: {
          deleteImageError: [deleteImageError.message],
        },
      };
    }
  }

  // 데이터 삭제
  const { error: deleteProductError } = await supabase.from("products").delete().eq("id", product.id);

  if (deleteProductError) {
    return {
      success: false,
      errors: {
        deleteProductError: [deleteProductError.message],
      },
    };
  }

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
      errors: z.flattenError(result.error).fieldErrors,
      values: {
        name: raw.name,
        brand: raw.brand,
        price: raw.price,
        description: raw.description,
        category: raw.category,
        sex: raw.sex,
      },
    };
  }

  const supabase = await createClient();
  let updatedImagePath = "";

  // 이미지 업데이트
  if (raw.image?.size > 0) {
    const filePath = originalData.image.split("/products/")[1];
    const { data, error: imageUpdateError } = await supabase.storage.from("products").update(filePath, raw.image, {
      upsert: true,
    });

    if (imageUpdateError) {
      return {
        success: false,
        errors: {
          imageUpdateError: [imageUpdateError.message],
        },
      };
    }

    updatedImagePath = supabase.storage.from("products").getPublicUrl(data.path).data.publicUrl;
  }

  const { data: category } = await supabase
    .from("category")
    .select()
    .eq("sex", raw.sex)
    .eq("name", raw.category)
    .overrideTypes<Category[]>();

  const dataToUpdate = {
    name: raw.name,
    brand: raw.brand,
    price: raw.price,
    category: `${raw.sex}/${raw.category}`,
    description: raw.description,
    cat_id: category![0].id,
  };

  const { error: productUpdateError } = await supabase
    .from("products")
    .update(updatedImagePath.length > 0 ? Object.assign(dataToUpdate, { image: updatedImagePath }) : dataToUpdate)
    .eq("id", originalData.id);

  if (productUpdateError) {
    return {
      success: false,
      errors: {
        productUpdateError: [productUpdateError.message],
      },
    };
  }

  revalidatePath("/admin/product");
  return { success: true };
}

export async function getProductByName(name: string): Promise<Products[]> {
  const supabase = await createClient();

  const { data } = await supabase.rpc("search_product_by_compact_name", {
    search_text: name.trim(),
  });

  return data || [];
}

export async function getProductsByPagination(query: string, options: { pageNum: number; itemsPerPage: number }) {
  const from = (options.pageNum - 1) * options.itemsPerPage;
  const to = from + options.itemsPerPage - 1;

  const supabase = await createClient();
  const { data, count, error } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("category", query)
    .range(from, to)
    .overrideTypes<Products[]>();

  if (error) {
    throw new Error(error.message);
  }

  return { data, count: count || 0 };
}

export async function getAllProductsByPagination(options: { pageNum: number; itemsPerPage: number }) {
  const from = (options.pageNum - 1) * options.itemsPerPage;
  const to = from + options.itemsPerPage - 1;

  const supabase = await createClient();
  const { data, count, error } = await supabase
    .from("products")
    .select("*", { count: "exact" })
    .range(from, to)
    .overrideTypes<Products[]>();

  if (error) {
    throw new Error(error.message);
  }

  return { data, count: count || 0 };
}

export async function getProductById(id: string): Promise<ApiResponse<null, Products | null>> {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select().eq("id", id).single<Products>();

  return {
    success: true,
    data,
  };
}
