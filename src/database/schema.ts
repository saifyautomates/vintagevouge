export type Category =
  | 'all'
  | 'boxy-shirts'
  | 'denim-workwear'
  | 'leather-jackets'
  | 'vintage-tees'
  | 'dresses-corsets';

export interface Measurements {
  pitToPit: string;
  length: string;
  shoulders: string;
  sleeve: string;
}

export interface ProductRecord {
  id: string;
  referenceCode: string; // e.g. "VV-D24-01"
  title: string;
  subtitle: string;
  category: Category;
  era: string; // e.g. "Late 90s Archive"
  origin: string; // e.g. "Sourced in Tokyo • Curated in Kota Hub"
  price: number; // In INR (₹)
  originalEstimatePrice?: number;
  size: 'XS' | 'S' | 'Boxy M' | 'Oversized L' | 'Relaxed XL' | 'Free Size';
  conditionRating: '10/10 Deadstock' | '9.8/10 Near Mint' | '9.4/10 Authentic Patina' | '9.0/10 Distressed Vintage';
  rarity: '1-of-1 Specimen' | 'Vault Archive' | 'Rare Archival Discovery';
  dropBatch: string;
  fabric: string;
  measurements: Measurements;
  description: string;
  provenance: string;
  images: string[];
  inStock: boolean;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type OrderChannel = 'Online Store' | 'In-Store POS' | 'Instagram Direct';
export type PaymentMethod =
  | 'UPI (GPay / PhonePe / Paytm)'
  | 'Cash Tender'
  | 'Card / POS Terminal'
  | 'Razorpay NetBanking';
export type OrderStatus = 'Completed' | 'Dispatched' | 'Sanitizing' | 'Wax-Sealing' | 'Cancelled';

export interface OrderItem {
  productId: string;
  referenceCode: string;
  title: string;
  size: string;
  unitPrice: number;
  quantity: number; // strictly 1 for 1-of-1 pieces
}

export interface OrderRecord {
  id: string;
  channel: OrderChannel;
  customerName: string;
  customerContact?: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  totalAmount: number; // in INR (₹)
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  cashTendered?: number;
  changeGiven?: number;
  trackingNumber?: string;
  notes?: string;
  timestamp: string;
  createdAt: string;
}

export interface DropConfigRecord {
  id: string;
  title: string;
  scheduledLaunch: string;
  isVipGateLocked: boolean;
  vipPasscode: string;
  announcementText: string;
  updatedAt: string;
}

export interface CouponRecord {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number; // e.g. 10 for 10%, 500 for ₹500
  minOrderValue?: number;
  active: boolean;
  notes?: string;
  createdAt: string;
}

export interface DatabaseState {
  products: ProductRecord[];
  orders: OrderRecord[];
  dropConfig: DropConfigRecord;
  coupons?: CouponRecord[];
}

