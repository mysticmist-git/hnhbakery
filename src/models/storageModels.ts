import { PathWithUrl } from '@/lib/models';
import Batch from './batch';
import Product from './product';
import ProductType from './productType';

export type BaseModel = {
  id: string;
};

export type StorageProductType = {
  productCount: number;
  imageURL: string;
} & ProductType;

export type StorageProduct = { imageUrls: PathWithUrl[] } & Product;

export type StorageBatch = {
  material: string;
  size: string;
  price: number;
} & Batch;

export type ModalProductType = StorageProductType;
export type ModalProduct = StorageProduct;
export type ModalBatch = StorageBatch;

export interface ProductTypeWithCount extends ProductType {
  count: number;
}
