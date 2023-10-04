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
 * Sale which come with some discount
 */
type Sale = WithCreatedUpdated &
  WithActive &
  WithId & {
    name: string;
    code: string;
    description: string;
    percent: number;
    limit: number;
    image: string;
    start_at: Date;
    end_at: Date;
  };

type SaleTableRow = Sale & {
  numberOfUse?: number;
  totalSalePrice?: number;
};

const saleConverter: FirestoreDataConverter<Sale> = {
  toFirestore: function (modelObject: WithFieldValue<Sale>): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): Sale {
    const data: Sale = {
      id: snapshot.id,
      ...snapshot.data(options),
    } as Sale;
    return data;
  },
};

export default Sale;
export type { Sale, SaleTableRow };
export { saleConverter };
