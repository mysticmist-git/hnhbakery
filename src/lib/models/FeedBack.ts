import BaseObject from './BaseObject';

export interface FeedbackObject extends BaseObject {
  id: string;
  rating: number;
  comment: string;
  product_id: string;
  user_id: string;
}
