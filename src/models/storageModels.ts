import { PathWithUrl } from '@/lib/models';
import Batch from './batch';
import Product from './product';
import ProductType from './productType';

type StorageProductType = {
  productCount: number;
  imageURL: string;
} & ProductType;

type StorageProduct = { imageUrls: PathWithUrl[] } & Product;

type StorageBatch = {
  productType_id: string;
  material: string;
  size: string;
  price: number;
} & Batch;

export type { StorageBatch, StorageProduct, StorageProductType };
