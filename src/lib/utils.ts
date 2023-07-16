import {
  BaseObject,
  BatchObject,
  ProductObject,
  ProductTypeObject,
} from './models';

export function createProductTypeObject(source: BaseObject): ProductTypeObject {
  const convertedSourcee = { ...source } as ProductTypeObject;

  const productTypeObject: ProductTypeObject = {
    id: convertedSourcee.id,
    name: convertedSourcee.name,
    description: convertedSourcee.description,
    image: convertedSourcee.image,
    isActive: convertedSourcee.isActive,
  };

  return productTypeObject;
}

export function createBatchObject(source: BaseObject): BatchObject {
  const convertedSourcee = { ...source } as BatchObject;

  const batchObject: BatchObject = {
    id: convertedSourcee.id,
    totalQuantity: convertedSourcee.totalQuantity,
    soldQuantity: convertedSourcee.soldQuantity,
    MFG: convertedSourcee.MFG,
    EXP: convertedSourcee.EXP,
    discount: convertedSourcee.discount,
    variant_id: convertedSourcee.variant_id,
    product_id: convertedSourcee.product_id,
  };

  return batchObject;
}

export function createProductObject(source: BaseObject): ProductObject {
  const convertedSourcee = { ...source } as ProductObject;

  const productObject: ProductObject = {
    id: convertedSourcee.id,
    productType_id: convertedSourcee.productType_id,
    colors: convertedSourcee.colors,
    description: convertedSourcee.description,
    howToUse: convertedSourcee.howToUse,
    images: convertedSourcee.images,
    isActive: convertedSourcee.isActive,
    ingredients: convertedSourcee.ingredients,
    name: convertedSourcee.name,
    preservation: convertedSourcee.preservation,
    variants: convertedSourcee.variants,
  };

  return productObject;
}
export function isVNPhoneNumber(number: string) {
  return /([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/.test(number);
}

export function formatPrice(price: number | undefined): string {
  if (!price) {
    return '0 đồng';
  }
  const formatter = new Intl.NumberFormat('vi-VN');
  return formatter.format(price) + ' đồng';
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

export function formatDateString(value: Date | undefined, format = ''): string {
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
