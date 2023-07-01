import BaseObject from './BaseObject';

export type BatchDiscount = {
  date: Date;
  percent: number;
};

export interface BatchObject extends BaseObject {
  id: string;
  totalQuantity: number;
  soldQuantity: number;
  MFG: Date;
  EXP: Date;
  discount: BatchDiscount;
  variant_id: string;
  product_id: string;
}

export function createBatchObjecet(source: BaseObject): BatchObject {
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
