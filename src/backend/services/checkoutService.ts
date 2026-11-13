import { productRepository } from '../../database/repositories/productRepository';
import { orderRepository } from '../../database/repositories/orderRepository';
import { OrderRecord, OrderChannel, PaymentMethod } from '../../database/schema';

export interface CheckoutRequest {
  channel: OrderChannel;
  customerName: string;
  customerContact?: string;
  productIds: string[];
  discountPercent?: number;
  paymentMethod: PaymentMethod;
  cashTendered?: number;
}

export interface CheckoutResult {
  order: OrderRecord;
  upiPaymentString?: string;
  changeDue?: number;
}

export class CheckoutService {
  public executeCheckout(req: CheckoutRequest): CheckoutResult {
    const products = req.productIds.map((id) => {
      const p = productRepository.getById(id);
      if (!p) throw new Error(`Product ${id} not found.`);
      if (!p.inStock) throw new Error(`Specimen [${p.referenceCode}] ${p.title} is already claimed.`);
      return p;
    });

    const subtotal = products.reduce((sum, p) => sum + p.price, 0);
    const discountRate = (req.discountPercent || 0) / 100;
    const discountAmount = Math.round(subtotal * discountRate);
    const totalAmount = subtotal - discountAmount;

    // Change calculation if Cash
    let changeDue: number | undefined;
    if (req.paymentMethod === 'Cash Tender' && req.cashTendered !== undefined) {
      if (req.cashTendered < totalAmount) {
        throw new Error(`Insufficient cash. Due: ₹${totalAmount}, Received: ₹${req.cashTendered}`);
      }
      changeDue = req.cashTendered - totalAmount;
    }

    // Dynamic Indian UPI String:
    // upi://pay?pa=vintagevogue@upi&pn=Vintage%20Vogue%20India&am=3499&cu=INR&tn=Drop24
    const upiPaymentString = `upi://pay?pa=vintagevogue@upi&pn=Vintage%20Vogue%20India&am=${totalAmount}&cu=INR&tn=VV-Order`;

    // Atomic stock deduction for each 1-of-1 piece
    products.forEach((p) => {
      productRepository.atomicDeduct1of1(p.id);
    });

    const trackingNumber =
      req.channel === 'Online Store'
        ? `BD-${Math.floor(10000000 + Math.random() * 90000000)}-IN`
        : req.channel === 'In-Store POS'
        ? `POS-KOTA-CTR-${Math.floor(100 + Math.random() * 900)}`
        : undefined;

    // Create persistent order
    const order = orderRepository.create({
      channel: req.channel,
      customerName: req.customerName || 'Walk-in Customer',
      customerContact: req.customerContact,
      items: products.map((p) => ({
        productId: p.id,
        referenceCode: p.referenceCode,
        title: p.title,
        size: p.size,
        unitPrice: p.price,
        quantity: 1,
      })),
      subtotal,
      discountAmount,
      totalAmount,
      paymentMethod: req.paymentMethod,
      status: req.channel === 'In-Store POS' ? 'Completed' : 'Sanitizing',
      cashTendered: req.cashTendered,
      changeGiven: changeDue,
      trackingNumber,
    });

    return {
      order,
      upiPaymentString,
      changeDue,
    };
  }
}

export const checkoutService = new CheckoutService();

