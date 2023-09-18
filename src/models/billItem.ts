import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import WithCreatedUpdated from './created_updated';

/**
 * Bill item which belongs to a bill
 */
type BillItem = WithCreatedUpdated & {
  id: string;
  price: number;
  amount: number;
  discount: number;
  total_price: number;
  total_discount: number;
  final_price: number;
  batch_id: string;
  bill_id: string;
};

const billItemConverter: FirestoreDataConverter<BillItem> = {
  toFirestore: function (modelObject: WithFieldValue<BillItem>): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): BillItem {
    const data: BillItem = {
      id: snapshot.id,
      ...snapshot.data(options),
    } as BillItem;
    return data;
  },
};

export default BillItem;
export { billItemConverter };
