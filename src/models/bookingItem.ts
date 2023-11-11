import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import WithCreatedUpdated from './created_updated';
import WithId from './withId';
import Size from './size';

type Message = {
  content: string;
  color: string;
};

type CakeStyle = {
  model_3d_id: string;
  position: number[];
  rotation: number[];
  color: string;
};

type BookingItem = WithId & {
  images?: string[];
  occasion?: string;
  size: string;
  cake_base_id: string;
  cake_pan: CakeStyle;
  cake_decor: CakeStyle[];
  message: Message;
  note: string;
};

const bookingItemConverter: FirestoreDataConverter<BookingItem> = {
  toFirestore: function (
    modelObject: WithFieldValue<BookingItem>
  ): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): BookingItem {
    const data = snapshot.data(options);

    const convertedData: BookingItem = {
      ...data,
      id: snapshot.id,
    } as BookingItem;
    return convertedData;
  },
};

export default BookingItem;

export { bookingItemConverter };
