import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import WithCreatedUpdated from './created_updated';
import Discount from './discount';
import WithId from './withId';

/**
 * Batch
 * Foreign Keys: variant_id, product_id
 */
export type Batch = WithCreatedUpdated &
  WithId & {
    quantity: number;
    sold: number;
    mfg: Date;
    exp: Date;
    discount: Discount;
    variant_id: string;
    product_id: string;
    product_type_id: string;
  };

const batchConverter: FirestoreDataConverter<Batch> = {
  toFirestore: function (modelObject: WithFieldValue<Batch>): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): Batch {
    const data: Batch = {
      id: snapshot.id,
      ...snapshot.data(options),
    } as Batch;
    return data;
  },
};

export default Batch;
export { batchConverter };
