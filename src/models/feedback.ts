import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import WithCreatedUpdated from './created_updated';
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
export { feedbackConverter };
