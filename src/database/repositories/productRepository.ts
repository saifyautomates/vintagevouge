import { db } from '../db';
import { ProductRecord, Category } from '../schema';

export class ProductRepository {
  public getAll(): ProductRecord[] {
    return db.getState().products;
  }

  public getById(id: string): ProductRecord | undefined {
    return db.getState().products.find((p) => p.id === id);
  }

  public getByReferenceCode(code: string): ProductRecord | undefined {
    const clean = code.trim().toLowerCase();
    return db.getState().products.find(
      (p) => p.referenceCode.toLowerCase() === clean
    );
  }

  public filterByCategory(category: Category): ProductRecord[] {
    const products = this.getAll();
    if (category === 'all') return products;
    return products.filter((p) => p.category === category);
  }

  public search(query: string): ProductRecord[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.getAll();
    return this.getAll().filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.referenceCode.toLowerCase().includes(q) ||
        p.era.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  public create(product: ProductRecord): ProductRecord {
    return db.transaction((database) => {
      const state = database.getState();
      // Ensure unique reference code
      const exists = state.products.some(
        (p) => p.referenceCode.toLowerCase() === product.referenceCode.toLowerCase()
      );
      if (exists) {
        throw new Error(`Product reference code ${product.referenceCode} already exists.`);
      }
      database.setProducts([product, ...state.products]);
      return product;
    });
  }

  public update(id: string, updates: Partial<ProductRecord>): ProductRecord {
    return db.transaction((database) => {
      const state = database.getState();
      const index = state.products.findIndex((p) => p.id === id);
      if (index === -1) {
        throw new Error(`Product with ID ${id} not found.`);
      }
      const updated: ProductRecord = {
        ...state.products[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      const newProducts = [...state.products];
      newProducts[index] = updated;
      database.setProducts(newProducts);
      return updated;
    });
  }

  public toggleStock(id: string, inStock: boolean): ProductRecord {
    return this.update(id, { inStock });
  }

  // Atomic 1-of-1 inventory deduction
  public atomicDeduct1of1(productId: string): ProductRecord {
    return db.transaction((database) => {
      const state = database.getState();
      const product = state.products.find((p) => p.id === productId);
      if (!product) {
        throw new Error(`Product ${productId} does not exist.`);
      }
      if (!product.inStock) {
        throw new Error(`Conflict: Specimen [${product.referenceCode}] is already sold out.`);
      }
      const updated = {
        ...product,
        inStock: false,
        updatedAt: new Date().toISOString(),
      };
      const newProducts = state.products.map((p) => (p.id === productId ? updated : p));
      database.setProducts(newProducts);
      return updated;
    });
  }
}

export const productRepository = new ProductRepository();

