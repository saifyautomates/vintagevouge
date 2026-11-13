import { db } from '../db';
import { DropConfigRecord } from '../schema';

export class DropRepository {
  public getConfig(): DropConfigRecord {
    return db.getState().dropConfig;
  }

  public updateConfig(updates: Partial<DropConfigRecord>): DropConfigRecord {
    return db.transaction((database) => {
      const current = database.getState().dropConfig;
      const updated: DropConfigRecord = {
        ...current,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      database.setDropConfig(updated);
      return updated;
    });
  }

  public verifyPasscode(code: string): boolean {
    const config = this.getConfig();
    if (!config.isVipGateLocked) return true;
    return config.vipPasscode.trim().toUpperCase() === code.trim().toUpperCase();
  }
}

export const dropRepository = new DropRepository();

