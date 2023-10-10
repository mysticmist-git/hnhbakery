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
    const data = snapshot.data(options);

    const convertedData: Batch = {
      ...data,
      id: snapshot.id,
      mfg: data.mfg.toDate(),
      exp: data.exp.toDate(),
      discount: {
        ...data.discount,
        start_at: data.discount.start_at.toDate(),
      },
      created_at: data.created_at.toDate(),
      updated_at: data.updated_at.toDate(),
    } as Batch;

    return convertedData;
  },
};

export default Batch;
export { batchConverter };
