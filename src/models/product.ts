import WithCreatedUpdated from "./created_updated";
import WithActive from "./withActive";

/**
 * Product
 * Available Collection: variants, feedbacks
 */
type Product = WithCreatedUpdated & WithActive & {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  colors: string[];
  how_to_use: string;
  preservation: string;
  images: string[];
  product_type_id: string;
}

export default Product;
