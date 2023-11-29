import {
  fetchProductTypesForStoragePage as createProductTypesForStoragePage,
  fetchBatchesForStoragePage,
  fetchProductsForStoragePage,
} from '@/lib/firestore';
import { BaseModel } from '@/models/storageModels';
import User from '@/models/user';

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
  private user: User;

  constructor(user: User) {
    this.user = user;
  }

  async createDocs(): Promise<BaseModel[]> {
    const docs = await fetchBatchesForStoragePage(this.user);
    return docs;
  }
}
