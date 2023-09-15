import WithCreatedUpdated from "./created_updated";
import WithActive from "./withActive";

/**
 * Product type
 * Available Collection: products
 */
type ProductType = WithCreatedUpdated & WithActive & {
  id: string;
  name: string;
  descripion: string;
  image: string;
}

export default ProductType;
