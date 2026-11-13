import { ProductRecord, Category, Measurements, OrderRecord, OrderItem, OrderStatus, OrderChannel, PaymentMethod } from '../database/schema';

export type { Category, Measurements, OrderRecord, OrderItem, OrderStatus, OrderChannel, PaymentMethod };
export type Product = ProductRecord;

export interface CartItem {
  product: Product;
  quantity: number;
}

