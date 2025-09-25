import Image from "next/image";
import Link from "next/link";

import { Products } from "@/types/products";
import { createClient } from "@/utils/supabase/server";
import { cn } from "@/lib/utils";

export default async function RecentProducts() {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select().order("created_at", { ascending: false }).limit(4);

  return (
    <div className={cn("grid grid-cols-2 gap-1", "md:gap-2", "lg:grid-cols-4 lg:gap-4")}>
      {data?.map((product: Products) => (
        <div key={product.id} className="w-full aspect-square rounded-lg relative overflow-hidden group">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 50vw, 20vw"
          />

          <Link href={`/${product.category}/${product.id}`}>
            <div
              className={cn(
                "bg-[rgba(0,0,0,0.25)] absolute top-0 left-0 w-full h-full cursor-pointer",
                "flex items-center justify-center",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              )}
            >
              <p className="text-white font-semibold">{product.name}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
