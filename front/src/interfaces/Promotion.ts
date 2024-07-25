export interface Promotion {
  id: string;
  type: string;
  created_at: Date;
  expiry_date: Date;
  is_one_time: boolean;
  products_has_promotions: [];
}
