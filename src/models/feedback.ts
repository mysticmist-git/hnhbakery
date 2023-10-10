import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import WithCreatedUpdated from './created_updated';
import Product from './product';
import User from './user';
import WithId from './withId';

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
    const data = snapshot.data(options);

    const convertedData: Feedback = {
      ...data,
      id: snapshot.id,
      created_at: data.created_at.toDate(),
      updated_at: data.updated_at.toDate(),
    } as Feedback;
    return convertedData;
  },
};

export default Feedback;
export { feedbackConverter };
export type { Feedback, FeedbackTableRow };
