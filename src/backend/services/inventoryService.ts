import { productRepository } from '../../database/repositories/productRepository';
import { ProductRecord } from '../../database/schema';

export class InventoryService {
  public getLiveCatalog(): ProductRecord[] {
    return productRepository.getAll();
  }

  public getAvailableSpecimens(): ProductRecord[] {
    return productRepository.getAll().filter((p) => p.inStock);
  }

  public toggleStockStatus(productId: string, inStock: boolean): ProductRecord {
    return productRepository.toggleStock(productId, inStock);
  }

  public addNewSpecimen(specimenData: Omit<ProductRecord, 'id' | 'createdAt' | 'updatedAt'>): ProductRecord {
    const id = `vv-${Date.now()}`;
    const newSpecimen: ProductRecord = {
      ...specimenData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return productRepository.create(newSpecimen);
  }

  public deductSpecimenForOrder(productId: string): ProductRecord {
    return productRepository.atomicDeduct1of1(productId);
  }
}

export const inventoryService = new InventoryService();

