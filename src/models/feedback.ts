import WithCreatedUpdated from "./created_updated";

/**
 * Feedback of users about products
 */
export type Feedback = WithCreatedUpdated & {
  id: string;
  comment: string;
  rating: number;
  product_id: string;
  user_id: string;
};

