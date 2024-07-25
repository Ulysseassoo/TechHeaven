import type { Product } from "./Product";

export interface StockHistory {
  id: string;
  date: string;
  quantity: number;
  product_id: string;
  product: Product;
}

export interface Stats {
  stockProductsEvolution: StockEvolution[];
  topSixProductsInStock: StockProducts[];
}

interface StockEvolution {
  endDate: string;
  endQuantity: number;
  startDate: number;
  startQuantity: number;
  product: Product;
}

interface StockProducts {
  endDate: string;
  endQuantity: number;
  startDate: number;
  startQuantity: number;
  product: Product;
  quantityDifference: number;
}
