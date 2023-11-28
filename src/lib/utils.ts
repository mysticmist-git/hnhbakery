import Batch from '@/models/batch';
import Product from '@/models/product';
import ProductType from '@/models/productType';
import { BaseModel } from '@/models/storageModels';

// TODO: move this to lib.
export function createProductTypeObject(source: BaseModel): ProductType {
  const convertedSource = { ...source } as ProductType;

  const productTypeObject: ProductType = {
    id: convertedSource.id,
    name: convertedSource.name,
    description: convertedSource.description,
    image: convertedSource.image,
    active: convertedSource.active,
    created_at: convertedSource.created_at,
    updated_at: convertedSource.updated_at,
  };

  return productTypeObject;
}

// TODO: move this to lib.
export function createBatchObject(source: BaseModel): Batch {
  const convertedSourcee = { ...source } as Batch;

  const batchObject: Batch = {
    id: convertedSourcee.id,
    quantity: convertedSourcee.quantity,
    sold: convertedSourcee.sold,
    mfg: convertedSourcee.mfg,
    exp: convertedSourcee.exp,
    discount: convertedSourcee.discount,
    variant_id: convertedSourcee.variant_id,
    product_id: convertedSourcee.product_id,
    product_type_id: convertedSourcee.product_type_id,
    branch_id: convertedSourcee.branch_id,
    created_at: convertedSourcee.created_at,
    updated_at: convertedSourcee.updated_at,
  };

  return batchObject;
}

// TODO: move this to lib.
export function createProductObject(source: BaseModel): Product {
  const convertedSourcee = { ...source } as Product;

  const productObject: Product = {
    id: convertedSourcee.id,
    product_type_id: convertedSourcee.product_type_id,
    colors: convertedSourcee.colors,
    description: convertedSourcee.description,
    how_to_use: convertedSourcee.how_to_use,
    images: convertedSourcee.images,
    active: convertedSourcee.active,
    ingredients: convertedSourcee.ingredients,
    name: convertedSourcee.name,
    preservation: convertedSourcee.preservation,
    created_at: convertedSourcee.created_at,
    updated_at: convertedSourcee.updated_at,
  };

  return productObject;
}
export function isVNPhoneNumber(number: string) {
  return /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/.test(number);
}

export function formatPrice(
  price: number | undefined,
  unitFormat: string = 'đồng'
): string {
  if (!price) {
    return '0' + ' ' + unitFormat;
  }
  const formatter = new Intl.NumberFormat('vi-VN');
  return formatter.format(price) + unitFormat;
}
export function filterDuplicates<T>(array: T[]) {
  return array.filter((item, index) => array.indexOf(item) === index);
}

export const filterDuplicatesById = <T extends { id: string }>(data: T[]) => {
  const ids: string[] = [];

  const uniqueData = data.filter((obj, index, self) => {
    if (!ids.includes(obj.id)) {
      ids.push(obj.id);
      return true;
    }

    return false;
  });

  return uniqueData;
};

export function formatDateString(
  value: Date | undefined,
  format: 'DD/MM/YYYY' | '' = ''
): string {
  if (!value) {
    return 'Trống';
  }
  if (format == 'DD/MM/YYYY') {
    return new Date(value).toLocaleString('vi-VI', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } else {
    return new Date(value).toLocaleString('vi-VI', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

export function validateEmail(mail: string) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
}
