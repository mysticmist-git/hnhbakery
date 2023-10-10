import { Theme } from '@mui/material';
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import Address from './address';
import WithCreatedUpdated from './created_updated';
import WithId from './withId';

type DeliveryState = 'issued' | 'delivering' | 'delivered' | 'cancelled';

/**
 * Stores data of a delivery
 * Foreign Keys: bill_id, shipper
 */
type Delivery = WithCreatedUpdated &
  WithId & {
    name: string;
    tel: string;
    mail: string;
    address_id: string;
    delivery_note: string;
    cancel_note: string;
    image: string;
    ship_date: Date;
    ship_time: string;
    start_at: Date;
    end_at: Date;
    state: DeliveryState;
    shipper_id: string; // the id of the shipper
  };

type DeliveryTableRow = Delivery & {
  address?: Address;
};

const deliveryConverter: FirestoreDataConverter<Delivery> = {
  toFirestore: function (modelObject: WithFieldValue<Delivery>): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): Delivery {
    const data = snapshot.data(options);

    const convertedData: Delivery = {
      ...data,
      id: snapshot.id,
      start_at: data.start_at.toDate(),
      end_at: data.end_at.toDate(),
      ship_date: data.ship_date.toDate(),
      created_at: data.created_at.toDate(),
      updated_at: data.updated_at.toDate(),
    } as Delivery;
    return convertedData;
  },
};

export function deliveryStateParse(state: DeliveryState | undefined) {
  switch (state) {
    case 'issued':
      return 'Chờ xử lý';
    case 'delivering':
      return 'Đang giao';
    case 'delivered':
      return 'Đã giao';
    case 'cancelled':
      return 'Đã hủy';
    default:
      return 'Lỗi';
  }
}

export function deliveryStateColorParse(
  theme: Theme,
  value: DeliveryState | undefined
) {
  switch (value) {
    case 'issued':
      return theme.palette.text.secondary;
    case 'delivering':
      return theme.palette.text.secondary;
    case 'delivered':
      return theme.palette.success.main;
    case 'cancelled':
      return theme.palette.secondary.main;
    default:
      return theme.palette.error.main;
  }
}

export default Delivery;
export { deliveryConverter };
export type { Delivery, DeliveryTableRow };
