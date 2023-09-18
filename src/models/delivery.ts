import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
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
    address: string;
    delivery_note: string;
    cancel_note: string;
    image: string;
    start_at: Date;
    end_at: Date;
    bill_id: string;
    state: DeliveryState;
    shipper: string; // the id of the shipper
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
    const data: Delivery = {
      id: snapshot.id,
      ...snapshot.data(options),
    } as Delivery;
    return data;
  },
};

export default Delivery;
export { deliveryConverter };
