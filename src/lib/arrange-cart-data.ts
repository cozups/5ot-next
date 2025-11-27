import { Cart } from "@/types/cart";

export function arrangeCartData(dbData: Cart[], localData: Cart[]) {
  let dataToInitialize: Cart[] = [];

  dbData.forEach((cart) => {
    // 같은 상품이 로컬 스토리지에도 있는지 확인
    const localItemAlreadyExists = localData.find((item) => item.product.id === cart.product.id);

    if (localItemAlreadyExists) {
      // 있으면 수량 합치기 및 기타 정보 병합
      const newItem = {
        product: cart.product,
        qty: String(Number(cart.qty) + Number(localItemAlreadyExists.qty)),
        isSelected: cart.isSelected || localItemAlreadyExists.isSelected,
      };

      // 로컬 스토리지 데이터에서 해당 아이템 제거
      localData = localData.filter((item) => item.product.id !== cart.product.id);

      // 병합된 아이템 추가
      dataToInitialize.push(newItem);
    }

    if (!localItemAlreadyExists) {
      // 없으면 그냥 DB 데이터 추가
      dataToInitialize.push(cart);
    }
  });

  // 남아있는 로컬 스토리지 데이터 추가
  dataToInitialize = [...localData, ...dataToInitialize];

  return dataToInitialize;
}
