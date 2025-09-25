import MainImageSlider from "@/components/home/main-image-slider";
import RecentProducts from "@/components/home/recent-products";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

export const metadata = {
  title: "5ot Next",
  description: "Welcome to 5ot-Next store",
};

export default async function Home() {
  return (
    <div className={cn("mx-auto", "lg:w-[64rem]")}>
      <div className="w-full">
        <MainImageSlider />
        <div>
          <h2 className="my-4 text-2xl font-bold">new</h2>
          <Suspense
            fallback={
              <div className={cn("grid grid-cols-2 gap-1", "md:gap-2", "lg:grid-cols-4 lg:gap-4")}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton
                    key={`recent-products-skeleton-${index}`}
                    className="w-full aspect-square rounded-lg mb-1"
                  />
                ))}
              </div>
            }
          >
            <RecentProducts />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
