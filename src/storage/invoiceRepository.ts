import AsyncStorage from '@react-native-async-storage/async-storage';
import { InvoiceData } from '../invoice/types';

/**
 * Persistence boundary for invoices.
 *
 * Current implementation: AsyncStorage (local, on-device only).
 * A Firebase/API implementation can be added later without touching the app —
 * screens only ever talk to this interface (plan.md §18).
 */
export interface InvoiceRepository {
  save(invoice: InvoiceData): Promise<void>;
  getAll(): Promise<InvoiceData[]>;
  getById(id: string): Promise<InvoiceData | null>;
  /** Count of invoices created since local midnight (used for invoice numbering). */
  countCreatedToday(): Promise<number>;
}

const STORAGE_KEY = 'invoices:v1';

class AsyncStorageInvoiceRepository implements InvoiceRepository {
  private async readAll(): Promise<InvoiceData[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as InvoiceData[];
    } catch {
      // ponytail: corrupt store -> start empty rather than crash the app
      return [];
    }
  }

  private async writeAll(invoices: InvoiceData[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  }

  async getAll(): Promise<InvoiceData[]> {
    return this.readAll();
  }

  async getById(id: string): Promise<InvoiceData | null> {
    const all = await this.readAll();
    return all.find((i) => i.id === id) ?? null;
  }

  async save(invoice: InvoiceData): Promise<void> {
    const all = await this.readAll();
    const index = all.findIndex((i) => i.id === invoice.id);
    if (index >= 0) all[index] = invoice;
    else all.push(invoice);
    await this.writeAll(all);
  }

  async countCreatedToday(): Promise<number> {
    const all = await this.readAll();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return all.filter((i) => i.createdAt >= startOfDay.toISOString()).length;
  }
}

// ponytail: single shared store — switch to per-user keys if multi-user ever lands
export const invoiceRepository: InvoiceRepository =
  new AsyncStorageInvoiceRepository();
