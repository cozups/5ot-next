export interface Products {
  id: string;
  created_at: string;
  name: string;
  price: string;
  description: string;
  image: string;
  brand: string;
  category: string;
  rate: number;
  cat_id: string;
}

export interface RecentProducts {
  product: {
    id: string;
    name: string;
    image: string;
    price: string;
  };
  addedAt: string;
}
