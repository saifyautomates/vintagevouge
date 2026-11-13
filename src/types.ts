import { ProductRecord, Category, Measurements } from './database/schema';

export type { Category, Measurements };
export type Product = ProductRecord;

export interface CartItem {
  product: Product;
  quantity: number;
}
