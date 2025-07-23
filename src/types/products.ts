export type Products = {
  id: string;
  created_at: string;
  name: string;
  price: string;
  description: string;
  image: string;
  brand: string;
  category: string;
  rate: number;
};

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
