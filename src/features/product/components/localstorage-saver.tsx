"use client";

import { Products } from "@/types/products";
import { useEffect } from "react";

interface ProductInfo {
  id: string;
  name: string;
  image: string;
  price: string;
}

export default function LocalStorageSaver({ product }: { product: Products }) {
  useEffect(() => {
    const productInfoToSave = { id: product.id, name: product.name, image: product.image || "", price: product.price };

    let storedProducts = JSON.parse(localStorage.getItem("recentViewedProducts") || "[]") as ProductInfo[];

    const isIncluded = storedProducts.some((p) => p.id === product.id);
    if (!isIncluded) {
      storedProducts.unshift(productInfoToSave);
    } else {
      storedProducts = storedProducts.filter((p) => p.id !== product.id);
      storedProducts.unshift(productInfoToSave);
    }

    localStorage.setItem("recentViewedProducts", JSON.stringify(storedProducts.slice(0, 10)));
  });

  return null;
}
