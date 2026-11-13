import { db } from '../db';
import { OrderRecord, OrderStatus } from '../schema';

export class OrderRepository {
  public getAll(): OrderRecord[] {
    return db.getState().orders;
  }

  public getById(id: string): OrderRecord | undefined {
    return db.getState().orders.find((o) => o.id === id);
  }

  public create(orderData: Omit<OrderRecord, 'id' | 'timestamp' | 'createdAt'>): OrderRecord {
    return db.transaction((database) => {
      const state = database.getState();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newOrder: OrderRecord = {
        ...orderData,
        id: `ORD-${randomNum}`,
        timestamp:
          new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            day: 'numeric',
            month: 'short',
          }) + ' IST',
        createdAt: new Date().toISOString(),
      };
      database.setOrders([newOrder, ...state.orders]);
      return newOrder;
    });
  }

  public updateStatus(id: string, status: OrderStatus, trackingNumber?: string): OrderRecord {
    return db.transaction((database) => {
      const state = database.getState();
      const index = state.orders.findIndex((o) => o.id === id);
      if (index === -1) throw new Error(`Order ${id} not found.`);

      const updated = {
        ...state.orders[index],
        status,
        ...(trackingNumber ? { trackingNumber } : {}),
      };
      const newOrders = [...state.orders];
      newOrders[index] = updated;
      database.setOrders(newOrders);
      return updated;
    });
  }

  public calculateTotalGMV(): number {
    return this.getAll().reduce((sum, ord) => sum + ord.totalAmount, 0);
  }
}

export const orderRepository = new OrderRepository();

