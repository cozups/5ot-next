import { Clothes } from './clothes';

export interface Orders {
  id: string;
  created_at: string;
  user_id: string;
  products: {
    id: string;
    name: string;
    price: string;
    count: string;
  }[];
  status: string;
  address: string;
  receiver: string;
  phoneNumber: string;
  deliveryRequest: string;
}

export interface Purchase {
  product: Clothes;
  qty: string;
}
