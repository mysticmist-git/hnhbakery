import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import WithActive from './withActive';
import WithId from './withId';

/**
 * Payment method
 */
type PaymentMethod = WithActive &
  WithId & {
    name: string;
    code: string;
    image: string;
  };

const paymentMethodConverter: FirestoreDataConverter<PaymentMethod> = {
  toFirestore: function (
    modelObject: WithFieldValue<PaymentMethod>
  ): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): PaymentMethod {
    const data: PaymentMethod = {
      id: snapshot.id,
      ...snapshot.data(options),
    } as PaymentMethod;
    return data;
  },
};

export default PaymentMethod;
export { paymentMethodConverter };
