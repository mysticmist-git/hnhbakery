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
    const data = snapshot.data(options);

    const convertedData: Contact = {
      ...snapshot.data(options),
      id: snapshot.id,
      created_at: data.created_at.toDate(),
      updated_at: data.updated_at.toDate(),
    } as Contact;
    return convertedData;
  },
};

export default Contact;
export { contactConverter };
