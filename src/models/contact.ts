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
 * Contact from anonynomous user
 */
type Contact = WithCreatedUpdated &
  WithId & {
    mail: string;
    name: string;
    tel: string;
    title: string;
    content: string;
    isRead?: boolean;
  };

const contactConverter: FirestoreDataConverter<Contact> = {
  toFirestore: function (modelObject: WithFieldValue<Contact>): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): Contact {
    const data: Contact = {
      id: snapshot.id,
      ...snapshot.data(options),
    } as Contact;
    return data;
  },
};

export default Contact;
export { contactConverter };
