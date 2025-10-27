import { Products } from "./products";

export type Review = {
  id: string;
  created_at: string;
  user_id: string;
  product_id: string;
  content: string;
  star: number;
  profiles?: { name: string };
  products: Products;
};
