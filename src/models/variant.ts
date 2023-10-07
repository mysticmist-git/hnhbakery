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
    const data: Variant = {
      id: snapshot.id,
      ...snapshot.data(options),
    } as Variant;

    return data;
  },
};

export default Variant;
export { variantConverter };
