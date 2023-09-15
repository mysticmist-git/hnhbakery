import WithCreatedUpdated from "./created_updated";
import { Discount } from "./discount";

/**
 * Batch
 */
export type Batch = WithCreatedUpdated & {
  id: string;
  quantity: number;
  sold: number;
  mfg: Date;
  exp: Date;
  discount: Discount;
  variant_id: string;
  product_id: string;
};

export default Batch;
