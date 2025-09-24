import { Products } from "@/types/products";
import { Star } from "lucide-react";
import Image from "next/image";

export default function ProductItem({ product }: { product: Products }) {
  return (
    <div className="cursor-pointer transition-scale duration-200 hover:scale-105">
      <div className="w-full aspect-square rounded-xl relative overflow-hidden">
        <Image
          src={product.image}
          fill
          alt={product.name}
          className="object-cover"
          sizes="(max-width: 768px) 45vw, 25vw)"
        />
      </div>
      <p className="text-lg font-semibold mt-2">{product.name}</p>
      <p className="text-sm text-gray-400">{product.brand}</p>
      <div className="flex justify-between mt-3">
        <div className="flex items-center gap-1">
          <Star fill="orange" className="w-4 h-4" />
          <span className="text-sm">{product.rate.toFixed(2)}</span>
        </div>
        <div>
          <span>{product.price.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  );
}
