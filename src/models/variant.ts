import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import WithCreatedUpdated from './created_updated';
import WithActive from './withActive';
import WithId from './withId';
import Batch from './batch';

/**
 * Variant of a product
 * Sub-Collections: batches
 * Foreign Keys: material, size, product_id
 */
type Variant = WithCreatedUpdated &
  WithActive &
  WithId & {
    material: string;
    size: string;
    price: number;
    product_id: string;
    product_type_id: string;
    batches: string[];
  };

type VariantTableRow = Variant & {
  batcheObjects?: Batch[];
};

const variantConverter: FirestoreDataConverter<Variant> = {
  toFirestore: function (modelObject: WithFieldValue<Variant>): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): Variant {
    const data = snapshot.data(options);

    const convertedData: Variant = {
      ...data,
      id: snapshot.id,
      created_at: data.created_at.toDate(),
      updated_at: data.updated_at.toDate(),
    } as Variant;

    return convertedData;
  },
};

export default Variant;
export type { Variant, VariantTableRow };
export { variantConverter };
