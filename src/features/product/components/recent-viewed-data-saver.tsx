"use client";

import { useUser } from "@/hooks/use-users";
import { Products } from "@/types/products";
import { useEffect } from "react";
import { updateRecentViewedProduct } from "../actions";
import { getRecentViewedProducts } from "../queries";
import { createClient } from "@/utils/supabase/client";

export default function RecentViewedDataSaver({ product }: { product: Products }) {
  const { user } = useUser();

  useEffect(() => {
    async function getStoredProducts() {
      const supabase = createClient();
      let { data: storedProducts } = await getRecentViewedProducts(supabase, user!.id);

      const productInfoToSave = {
        product: {
          id: product.id,
          name: product.name,
          image: product.image || "",
          price: product.price,
        },
        addedAt: new Date().toISOString(),
      };

      if (storedProducts) {
        const isIncluded = storedProducts.some((p) => p.product.id === product.id);
        if (!isIncluded) {
          storedProducts.unshift(productInfoToSave);
        } else {
          storedProducts = storedProducts.filter((p) => p.product.id !== product.id);
          storedProducts.unshift(productInfoToSave);
        }

        // 서버에도 저장
        updateRecentViewedProduct(user!.id, storedProducts.slice(0, 10));
      }
    }
    if (user) {
      getStoredProducts();
    }
  }, [user, product]);

  return null;
}
