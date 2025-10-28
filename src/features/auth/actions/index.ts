"use server";

import { revalidatePath } from "next/cache";
import { User } from "@supabase/supabase-js";

import { ApiResponse } from "@/types/response";
import { mapErrors } from "@/lib/handle-errors";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { removeImageFromStorage, uploadImageToStorage } from "@/actions/storage";
import { JoinFormData, joinFormSchema, LoginFormData, loginFormSchema } from "@/lib/validations-schema/auth";

export type JoinFormState = ApiResponse<JoinFormData, null>;
export type LoginFormState = ApiResponse<LoginFormData, null>;
export type UpdateFormState = ApiResponse<
  {
    username: string;
    image: File;
  },
  null
>;

export async function createUser(formData: FormData): Promise<JoinFormState> {
  const raw = {
    username: formData.get("username")?.toString() || "",
    phone: formData.get("phone")?.toString() || "",
    userEmail: formData.get("userEmail")?.toString() || "",
    password: formData.get("password")?.toString() || "",
  };

  // 유효성 검사
  const result = joinFormSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: mapErrors(result.error),
      values: raw,
    };
  }

  // 데이터 전송 및 유저 가입
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: raw.userEmail,
    password: raw.password,
    phone: raw.phone,
    options: {
      data: {
        username: raw.username,
        role: "normal",
        image: "",
        phone: raw.phone,
      },
    },
  });

  if (error) {
    return {
      success: false,
      errors: mapErrors(error),
      values: raw,
    };
  }

  return {
    success: true,
  };
}

export async function loginUser(formData: FormData): Promise<LoginFormState> {
  const raw = {
    userEmail: formData.get("userEmail")?.toString() || "",
    password: formData.get("password")?.toString() || "",
  };

  // 유효성 검사
  const result = loginFormSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      errors: mapErrors(result.error),
      values: raw,
    };
  }

  // 로그인 요청
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: raw.userEmail,
    password: raw.password,
  });

  if (error) {
    return {
      success: false,
      errors: mapErrors(error),
      values: raw,
    };
  }

  return {
    user: data.user,
    success: true,
  };
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      success: false,
      errors: mapErrors(error),
    };
  }

  return {
    success: true,
  };
}

export async function deleteUser(user: User) {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  if (error) {
    return {
      success: false,
      errors: mapErrors(error),
    };
  }

  // 유저의 프로필 이미지를 스토리지에서 삭제
  const image = user.user_metadata.image;
  if (image) {
    const path = image.split("/public/profile/")[1];
    const { error } = await removeImageFromStorage("profile", path);

    if (error) {
      return { success: false, errors: mapErrors(error) };
    }
  }

  // 로그인 세션 삭제
  await logout();
  return {
    success: true,
  };
}

export async function updateUser(user: User, prevState: UpdateFormState, formData: FormData): Promise<UpdateFormState> {
  const raw = {
    username: formData.get("username")?.toString() || "",
    image: formData.get("image") as File,
  };

  if (raw.username.trim().length < 1) {
    return {
      success: false,
      errors: {
        name: "validation",
        code: "validation",
        message: "형식에 맞지 않는 입력값입니다.",
        errors: {
          username: ["이름을 반드시 입력해주세요"],
        },
      },
    };
  }

  const supabase = await createClient();
  const dataToUpdate: { username: string; image?: string } = {
    username: raw.username,
  };

  // 이미지가 입력된 경우, 이미지 저장 or 기존 이미지 대체
  if (raw.image.size > 0) {
    const extension = raw.image.type.split("/")[1];
    const filename = `images/user${user.id.split("-")[0]}.${extension}`;

    // 이미지 업데이트
    const { data, error } = await uploadImageToStorage("profil", filename, raw.image, { upsert: true });

    if (error) {
      return {
        success: false,
        errors: mapErrors(error),
      };
    }

    dataToUpdate.image = data?.publicPath;

    // 업데이트 할 이미지가 이전의 이미자와 확장자가 같으면, 덮어쓰기 됨
    // 이전 이미지와 새로운 이미지의 확장자가 다른 경우, 새로운 이미지가 저장되고 이전의 이미지는 남아있게됨 -> 이전 이미지를 삭제 해야함
    const oldImage = user.user_metadata.image;
    const oldImageExtension = oldImage ? oldImage.split(".")[1] : null;

    // 확장자가 다르므로 삭제
    if (oldImageExtension !== extension) {
      const path = oldImage.split("/public/profile/")[1];
      const { error } = await removeImageFromStorage("profile", path);

      if (error) {
        return {
          success: false,
          errors: mapErrors(error),
        };
      }
    }
  }

  // 데이터 수정
  const { error: dataUpdateError } = await supabase.auth.updateUser({
    data: dataToUpdate,
  });

  if (dataUpdateError) {
    return {
      success: false,
      errors: mapErrors(dataUpdateError),
    };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
