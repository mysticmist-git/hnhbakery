import {
  fetchProductTypesForStoragePage as createProductTypesForStoragePage,
  fetchBatchesForStoragePage,
  fetchProductsForStoragePage,
} from '@/lib/firestore';
import { BaseObject } from '../models';

export interface StorageDocsFactory {
  createDocs(): Promise<BaseObject[]>;
}

export class ProductTypeStorageDocsFetcher implements StorageDocsFactory {
  async createDocs(): Promise<BaseObject[]> {
    const docs = await createProductTypesForStoragePage();
    return docs;
  }
}

export class ProductStorageDocsFetcher implements StorageDocsFactory {
  async createDocs(): Promise<BaseObject[]> {
    const docs = await fetchProductsForStoragePage();
    return docs;
  }
}

export class BatchStorageDocsFetcher implements StorageDocsFactory {
  async createDocs(): Promise<BaseObject[]> {
    const docs = await fetchBatchesForStoragePage();
    return docs;
  }
}
