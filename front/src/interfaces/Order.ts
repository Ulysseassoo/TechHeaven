import type { User } from "./User";

export interface Order {
  id: string;
  created_at: string;
  status: OrderStatus;
  user: User;
  order_details: OrderDetail[];
  total_amount: number;
}

export enum OrderStatus {
  PENDING = "En cours",
  COMPLETED = "completed",
  CANCELED = "canceled",
}

export interface OrderDetail {
  id: string;
  quantity: number;
  product_name: string;
  product_description: string;
  unit_price: number;
  order_id: string;
  product_id: string;
}
