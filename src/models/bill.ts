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
 * State of a bill
 */
type BillState =
  | 'issued'
  | 'pending'
  | 'paid'
  | 'overdue'
  | 'cancelled'
  | 'refunded';

/**
 * Bill
 * Sub-Collections: items,
 * Foreign Keys: payment_method_id, sale_id, customer_id
 */
type Bill = WithCreatedUpdated &
  WithId & {
    total_price: number;
    total_discount: number;
    sale_price: number;
    final_price: number;
    note: string;
    state: BillState;
    payment_method_id: string;
    sale_id: string;
    customer_id: string;
    paid_time: Date;
  };

const billConverter: FirestoreDataConverter<Bill> = {
  toFirestore: function (modelObject: WithFieldValue<Bill>): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): Bill {
    const data: Bill = {
      id: snapshot.id,
      ...snapshot.data(options),
    } as Bill;
    return data;
  },
};

export default Bill;
export { billConverter };
