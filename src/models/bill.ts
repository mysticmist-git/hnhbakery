import { Theme, useTheme } from '@mui/material';
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import { BillItemTableRow } from './billItem';
import Branch from './branch';
import WithCreatedUpdated from './created_updated';
import Delivery, { DeliveryTableRow } from './delivery';
import PaymentMethod from './paymentMethod';
import Sale from './sale';
import User from './user';
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
    delivery_id: string;
    paid_time: Date;
    branch_id: string;
    booking_item_id: string;
  };

type BillTableRow = Bill & {
  paymentMethod?: PaymentMethod;
  customer?: User;
  sale?: Sale;
  deliveryTableRow?: DeliveryTableRow | null;
  billItems?: BillItemTableRow[];
  branch?: Branch;
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
    const data = snapshot.data(options);

    const convertedData: Bill = {
      ...data,
      id: snapshot.id,
      paid_time: data.paid_time.toDate(),
      created_at: data.created_at.toDate(),
      updated_at: data.updated_at.toDate(),
    } as Bill;
    return convertedData;
  },
};

export function billStateContentParse(params: BillState | undefined) {
  switch (params) {
    case 'issued':
      return 'Lỗi';
    case 'pending':
      return 'Chưa thanh toán';
    case 'paid':
      return 'Đã thanh toán';
    case 'overdue':
      return 'Quá hạn';
    case 'cancelled':
      return 'Đã hủy';
    case 'refunded':
      return 'Hoàn tiền';
    default:
      return 'Lỗi';
  }
}

export function billStateColorParse(
  theme: Theme,
  value: BillState | undefined
) {
  switch (value) {
    case 'issued':
      return theme.palette.error.main;
    case 'pending':
      return theme.palette.text.secondary;
    case 'paid':
      return theme.palette.success.main;
    case 'overdue':
      return theme.palette.text.secondary;
    case 'cancelled':
      return theme.palette.error.main;
    case 'refunded':
      return theme.palette.secondary.main;
    default:
      return theme.palette.error.main;
  }
}

export default Bill;
export { billConverter };
export type { Bill, BillState, BillTableRow };
