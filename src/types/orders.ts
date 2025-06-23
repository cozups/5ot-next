import { Products } from './products';

export interface Order {
  id: string;
  created_at: string;
  user_id: string;
  products: {
    product: Products;
    qty: string;
  }[];
  status: string;
  address: string;
  receiver: string;
  phone: string;
  deliveryRequest: string;
  profiles?: { name: string };
}

export interface Purchase {
  product: Products;
  qty: string;
}
