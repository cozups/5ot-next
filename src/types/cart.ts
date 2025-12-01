import { Products } from "./products";

export interface Cart {
  product: Products;
  qty: string;
  isSelected?: boolean;
}
