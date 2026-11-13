import { inventoryService } from '../services/inventoryService';
import { checkoutService, CheckoutRequest, CheckoutResult } from '../services/checkoutService';
import { notificationService } from '../services/notificationService';
import { orderRepository } from '../../database/repositories/orderRepository';
import { dropRepository } from '../../database/repositories/dropRepository';
import { ProductRecord, OrderRecord, DropConfigRecord, OrderStatus } from '../../database/schema';

export const api = {
  products: {
    list: async (): Promise<ProductRecord[]> => {
      return inventoryService.getLiveCatalog();
    },
    getAvailable: async (): Promise<ProductRecord[]> => {
      return inventoryService.getAvailableSpecimens();
    },
    toggleStock: async (productId: string, inStock: boolean): Promise<ProductRecord> => {
      return inventoryService.toggleStockStatus(productId, inStock);
    },
    create: async (data: Omit<ProductRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductRecord> => {
      return inventoryService.addNewSpecimen(data);
    },
  },

  orders: {
    list: async (): Promise<OrderRecord[]> => {
      return orderRepository.getAll();
    },
    getRevenue: async (): Promise<number> => {
      return orderRepository.calculateTotalGMV();
    },
    updateStatus: async (orderId: string, status: OrderStatus, trackingNumber?: string): Promise<OrderRecord> => {
      return orderRepository.updateStatus(orderId, status, trackingNumber);
    },
  },

  checkout: {
    process: async (request: CheckoutRequest): Promise<CheckoutResult> => {
      return checkoutService.executeCheckout(request);
    },
  },

  drop: {
    getConfig: async (): Promise<DropConfigRecord> => {
      return dropRepository.getConfig();
    },
    updateConfig: async (updates: Partial<DropConfigRecord>): Promise<DropConfigRecord> => {
      return dropRepository.updateConfig(updates);
    },
    verifyPass: async (code: string): Promise<boolean> => {
      return dropRepository.verifyPasscode(code);
    },
  },

  notifications: {
    getWhatsAppUrl: (order: OrderRecord): string => {
      return notificationService.generateWhatsAppOrderUrl(order);
    },
    getThermalReceipt: (order: OrderRecord): string => {
      return notificationService.generateThermalReceiptText(order);
    },
  },
};

