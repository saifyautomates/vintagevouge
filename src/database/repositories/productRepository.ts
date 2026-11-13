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

  // Atomic batch deduction for multiple 1-of-1 pieces in a single atomic transaction
  public atomicDeductMultiple(productIds: string[]): ProductRecord[] {
    return db.transaction((database) => {
      const state = database.getState();
      const now = new Date().toISOString();
      const updatedProductsMap = new Map<string, ProductRecord>();

      for (const id of productIds) {
        const product = state.products.find((p) => p.id === id);
        if (!product) {
          throw new Error(`Product ${id} does not exist in catalog.`);
        }
        if (!product.inStock) {
          throw new Error(`Conflict: Specimen [${product.referenceCode}] is already sold out.`);
        }
        updatedProductsMap.set(id, {
          ...product,
          inStock: false,
          updatedAt: now,
        });
      }

      const newProducts = state.products.map((p) => updatedProductsMap.get(p.id) || p);
      database.setProducts(newProducts);
      return Array.from(updatedProductsMap.values());
    });
  }

  // Smart Aesthetic & Cross-Category Recommendation Algorithm
  public getRecommendations(currentProductId?: string, limit: number = 3): ProductRecord[] {
    const products = this.getAll().filter((p) => p.inStock);
    if (!currentProductId) {
      return products.slice(0, limit);
    }
    const current = this.getById(currentProductId);
    if (!current) {
      return products.slice(0, limit);
    }

    // Category affinity mapping for complementary vintage styling
    const complementaryCategories: Record<Category, Category[]> = {
      'all': ['boxy-shirts', 'denim-workwear', 'leather-jackets', 'vintage-tees', 'dresses-corsets'],
      'boxy-shirts': ['denim-workwear', 'vintage-tees', 'leather-jackets'],
      'denim-workwear': ['boxy-shirts', 'vintage-tees', 'leather-jackets'],
      'leather-jackets': ['boxy-shirts', 'vintage-tees', 'denim-workwear'],
      'vintage-tees': ['denim-workwear', 'boxy-shirts', 'leather-jackets'],
      'dresses-corsets': ['leather-jackets', 'boxy-shirts', 'denim-workwear'],
    };

    const preferredCategories = complementaryCategories[current.category] || [];

    const candidates = products.filter((p) => p.id !== current.id);

    // Score candidates based on complementary category, era affinity, and condition
    const scored = candidates.map((p) => {
      let score = 0;
      if (preferredCategories.includes(p.category)) score += 5;
      if (p.era === current.era) score += 3;
      if (p.size === current.size) score += 2;
      return { product: p, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.product);
  }

  // "Complete the Look" archival pairing logic
  public getCompleteTheLook(productId: string): ProductRecord[] {
    return this.getRecommendations(productId, 2);
  }
}

export const productRepository = new ProductRepository();

