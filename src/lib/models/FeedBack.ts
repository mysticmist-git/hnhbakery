export interface FeedbackObject {
  id: string;
  rating: number;
  comment: string;
  product_id: string;
  user_id: string;
}

export default class Feedback {
  id: string;
  rating: number;
  comment: string;
  product_id: string;
  user_id: string;

  constructor(
    id: string,
    rating: number,
    comment: string,
    product_id: string,
    user_id: string,
  ) {
    this.id = id;
    this.rating = rating;
    this.comment = comment;
    this.product_id = product_id;
    this.user_id = user_id;
  }

  static fromObject(feedbackObject: FeedbackObject): Feedback {
    return new Feedback(
      feedbackObject.id,
      feedbackObject.rating,
      feedbackObject.comment,
      feedbackObject.product_id,
      feedbackObject.user_id,
    );
  }
}
