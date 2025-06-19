import { Clothes } from './clothes';

export interface Cart {
  product: Clothes;
  qty: string;
  isSelected: boolean;
}
