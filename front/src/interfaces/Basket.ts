import type { Product } from "./Product";

export interface BasketProduct {
  product: Product;
  orderQuantity: number;
  id?: string;
}

export type Basket = BasketProduct[];
