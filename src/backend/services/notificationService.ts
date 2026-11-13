import { OrderRecord } from '../../database/schema';

export class NotificationService {
  public generateWhatsAppOrderUrl(order: OrderRecord): string {
    const itemsList = order.items
      .map((item) => `• [${item.referenceCode}] ${item.title} (${item.size}) - ₹${item.unitPrice.toLocaleString('en-IN')}`)
      .join('\n');

    const message = `Hello Vintage Vogue India! 🇮🇳
I have placed an order:
*Order ID:* ${order.id}
*Customer:* ${order.customerName}
*Total Paid:* ₹${order.totalAmount.toLocaleString('en-IN')} via ${order.paymentMethod}

*Items:*
${itemsList}

*Dispatch Studio:* Kota Hub, Rajasthan (Blue Dart Express)
Please confirm dispatch and tracking details!`;

    return `https://wa.me/919829012345?text=${encodeURIComponent(message)}`;
  }

  public generateThermalReceiptText(order: OrderRecord): string {
    const line = '----------------------------------------';
    const items = order.items
      .map(
        (i) =>
          `${i.referenceCode.padEnd(12)} ${i.title.slice(0, 16).padEnd(17)} ₹${i.unitPrice.toLocaleString('en-IN').padStart(7)}`
      )
      .join('\n');

    return `
========================================
         VINTAGE VOGUE INDIA
  Haute Archival & Heritage Atelier
  Sogaria / Workshop Rd, Kota 324002
      Instagram: @vintagevoguee_in
========================================
Receipt ID: ${order.id}
Date/Time : ${order.timestamp}
Channel   : ${order.channel}
Customer  : ${order.customerName}
${line}
REF          ITEM               PRICE
${line}
${items}
${line}
Subtotal : ₹${order.subtotal.toLocaleString('en-IN')}
Discount : ₹${order.discountAmount.toLocaleString('en-IN')}
TOTAL DUE: ₹${order.totalAmount.toLocaleString('en-IN')}
${line}
Payment Mode: ${order.paymentMethod}
${order.cashTendered ? `Cash Tender : ₹${order.cashTendered.toLocaleString('en-IN')}\nChange Given: ₹${(order.changeGiven || 0).toLocaleString('en-IN')}` : ''}
${order.trackingNumber ? `Ref / AWB   : ${order.trackingNumber}` : ''}
${line}
  * ALL ACQUISITIONS ARE STRICT 1-OF-1 *
   Steam sanitized in Kota with eucalyptus
   Thank you for supporting circular fashion!
========================================
`;
  }
}

export const notificationService = new NotificationService();

