import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import WithCreatedUpdated from './created_updated';
import WithId from './withId';
import User from './user';
import Product from './product';

/**
 * Feedback
 * Foreign Keys: product_id, user_id
 */
type Feedback = WithCreatedUpdated &
  WithId & {
    comment: string;
    rating: number;
    product_id: string;
    user_id: string;
    created_at: Date;
  };

type FeedbackTableRow = Feedback & {
  product?: Product;
  user?: User;
};

const feedbackConverter: FirestoreDataConverter<Feedback> = {
  toFirestore: function (modelObject: WithFieldValue<Feedback>): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): Feedback {
    const data: Feedback = {
      id: snapshot.id,
      ...snapshot.data(options),
    } as Feedback;
    return data;
  },
};

export default Feedback;
export type { Feedback, FeedbackTableRow };
export { feedbackConverter };
