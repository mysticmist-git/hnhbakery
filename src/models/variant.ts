import WithCreatedUpdated from "./created_updated";
import WithActive from "./withActive";

/**
 * Variant of a product
 * Available collections: batches
 */
type Variant = WithCreatedUpdated & WithActive & {
  id: string;
  material: string;
  size: string;
  price: number;
  product_id: string;
}

export default Variant;
