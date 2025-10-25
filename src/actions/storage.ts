"use server";

import { createClient } from "@/utils/supabase/server";

export async function getImageURL(bucket: string, imagePath: string | undefined) {
  if (!imagePath) return;

  const supabase = await createClient();

  const { data } = supabase.storage.from(bucket).getPublicUrl(imagePath);

  return data.publicUrl;
}

export async function uploadImageToStorage(
  bucket: string,
  fileName: string,
  image: File,
  options?: { upsert: boolean }
) {
  const supabase = await createClient();
  // 이미지 업로드(업데이트)
  const { data, error } = await supabase.storage.from(bucket).update(fileName, image, options);

  const uploadedImagePublicPath = await getImageURL(bucket, data?.path);

  return { data: { ...data, publicPath: uploadedImagePublicPath }, error };
}

export async function removeImageFromStorage(bucket: string, imagePath: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from(bucket).remove([imagePath]);

  return {
    data,
    error,
  };
}
