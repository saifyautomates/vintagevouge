import { DatabaseState, ProductRecord, OrderRecord, DropConfigRecord } from './schema';
import { SEED_PRODUCTS, SEED_ORDERS, SEED_DROP_CONFIG } from './seed';

type DatabaseListener = (state: DatabaseState) => void;

class TransactionalDatabase {
  private state: DatabaseState;
  private listeners: Set<DatabaseListener> = new Set();
  private storageKey = 'vv_production_database_v3';

  constructor() {
    this.state = this.loadInitialState();
  }

  private loadInitialState(): DatabaseState {
    if (typeof window === 'undefined') {
      return {
        products: SEED_PRODUCTS,
        orders: SEED_ORDERS,
        dropConfig: SEED_DROP_CONFIG,
      };
    }
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.products && Array.isArray(parsed.products)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[Database] Failed to read from localStorage, using seed data.', e);
    }
    return {
      products: SEED_PRODUCTS,
      orders: SEED_ORDERS,
      dropConfig: SEED_DROP_CONFIG,
    };
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
      } catch (e) {
        console.error('[Database] Failed to persist to localStorage', e);
      }
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.getState());
      } catch (err) {
        console.error('[Database] Listener error', err);
      }
    });
  }

  public subscribe(listener: DatabaseListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): DatabaseState {
    return {
      products: [...this.state.products],
      orders: [...this.state.orders],
      dropConfig: { ...this.state.dropConfig },
    };
  }

  // Transaction execution with automatic rollback
  public transaction<T>(operation: (db: TransactionalDatabase) => T): T {
    const snapshot = JSON.stringify(this.state);
    try {
      const result = operation(this);
      this.persist();
      return result;
    } catch (err) {
      console.error('[Database Transaction Failed] Rolling back snapshot...', err);
      this.state = JSON.parse(snapshot);
      throw err;
    }
  }

  // Direct state mutation methods
  public setProducts(products: ProductRecord[]) {
    this.state.products = products;
    this.persist();
  }

  public setOrders(orders: OrderRecord[]) {
    this.state.orders = orders;
    this.persist();
  }

  public setDropConfig(config: DropConfigRecord) {
    this.state.dropConfig = config;
    this.persist();
  }

  public resetToSeed() {
    this.state = {
      products: SEED_PRODUCTS,
      orders: SEED_ORDERS,
      dropConfig: SEED_DROP_CONFIG,
    };
    this.persist();
  }
}

export const db = new TransactionalDatabase();
