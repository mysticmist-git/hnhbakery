import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import WithCreatedUpdated from './created_updated';
import Batch from './batch';
import WithId from './withId';
import ProductType from './productType';
import Product from './product';
import Variant from './variant';

/**
 * Bill item which belongs to a bill
 */
type BillItem = WithCreatedUpdated &
  WithId & {
    price: number;
    amount: number;
    discount: number;
    total_price: number;
    total_discount: number;
    final_price: number;
    batch_id: string;
    bill_id: string;
  };

type BillItemTableRow = BillItem & {
  batch?: Batch;
  productType?: ProductType;
  product?: Product;
  variant?: Variant;
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
    const data = snapshot.data(options);

    const convertedData: BillItem = {
      ...data,
      id: snapshot.id,
      created_at: data.created_at.toDate(),
      updated_at: data.updated_at.toDate(),
    } as BillItem;
    return convertedData;
  },
};

export default BillItem;
export type { BillItem, BillItemTableRow };
export { billItemConverter };
