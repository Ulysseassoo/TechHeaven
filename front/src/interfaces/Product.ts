import type { Category } from "./Category";
import type { Promotion } from "./Promotion";

export interface Product {
    name: string;
    description: string;
    brand: string;
    price: number;
    promotion: Promotion | null;
    promotion_type: string | null;
    quantity: number;
    categoryId: string | null;
    id: string;
    category?: Category;
}