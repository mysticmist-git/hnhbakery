import {
  fetchProductTypesForStoragePage as createProductTypesForStoragePage,
  fetchBatchesForStoragePage,
  fetchProductsForStoragePage,
} from '@/lib/firestore';
import { BaseObject } from '../models';

type BaseModel = {
  id: string;
};

export interface StorageDocsFactory {
  createDocs(): Promise<BaseModel[]>;
}

export class ProductTypeStorageDocsFetcher implements StorageDocsFactory {
  async createDocs(): Promise<BaseModel[]> {
    const docs = await createProductTypesForStoragePage();
    return docs;
  }
}

export class ProductStorageDocsFetcher implements StorageDocsFactory {
  async createDocs(): Promise<BaseModel[]> {
    const docs = await fetchProductsForStoragePage();
    return docs;
  }
}

export class BatchStorageDocsFetcher implements StorageDocsFactory {
  async createDocs(): Promise<BaseModel[]> {
    const docs = await fetchBatchesForStoragePage();
    return docs;
  }
}
