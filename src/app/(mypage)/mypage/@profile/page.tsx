import Image from "next/image";
import { redirect } from "next/navigation";

import { cn, parseToKorTime } from "@/lib/utils";
import { getUser } from "@/features/auth";
import UpdateProfileDialog from "@/features/auth/ui/update-profile-dialog";

export default async function MypageProfile() {
  const { data: user } = await getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <div className={cn("w-24 h-24 rounded-full relative overflow-hidden", "md:w-48 md:h-48")}>
        <Image
          src={user?.user_metadata.image || "/images/user.png"}
          fill
          alt={`${user?.user_metadata.username}'s profile image`}
          className="object-cover"
          sizes="20vw"
          priority
        />
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="mb-8">
          <p className={cn("text-base font-bold", "md:text-2xl")}>{user?.user_metadata.username}</p>
          <p className={cn("text-xs text-gray-500 mt-1", "md:text-base")}>{user?.email}</p>
          <p className={cn("text-gray-500 mt-1 text-xs", "md:text-sm")}>가입일: {parseToKorTime(user.created_at)}</p>
        </div>
        <div className="self-end">
          <UpdateProfileDialog user={user} />
        </div>
      </div>
    </>
  );
}
