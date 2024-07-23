import type { Product } from "./Product";

export interface BasketProduct {
  product: Product;
  orderQuantity: number;
}

export type Basket = BasketProduct[];
