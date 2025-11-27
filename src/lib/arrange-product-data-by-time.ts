import { Products } from "@/types/products";

export function arrangeProductDataByTime<T extends { product: Partial<Products>; addedAt: string }>(
  dbData: T[],
  localData: T[]
) {
  let dataToInitialize: T[] = [];

  dbData.forEach((cart) => {
    const isExist = localData.some((item) => item.product.id === cart.product.id);

    if (!isExist) {
      dataToInitialize.push(cart);
    }
  });

  dataToInitialize = [...localData, ...dataToInitialize];

  dataToInitialize = dataToInitialize.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

  return dataToInitialize;
}
