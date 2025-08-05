import { cn } from "@/lib/utils";

export default function Footer() {
  return (
    <div className={cn("w-full h-16 flex justify-center items-center text-xs", "md:text-base", "lg:h-20")}>
      ⓒ2024. Kim Miso. All rights reserved.
    </div>
  );
}
