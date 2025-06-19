import { Clothes } from './clothes';

export interface Order {
  id: string;
  created_at: string;
  user_id: string;
  products: {
    product: Clothes;
    qty: string;
  }[];
  status: string;
  address: string;
  receiver: string;
  phoneNumber: string;
  deliveryRequest: string;
  profiles?: { name: string };
}

export interface Purchase {
  product: Clothes;
  qty: string;
}
