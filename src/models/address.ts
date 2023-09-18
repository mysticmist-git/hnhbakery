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
 * An address of an user;
 * Foreign Keys: user_id
 */
type Address = WithCreatedUpdated &
  WithId & {
    address: string;
    user_id: string;
  };

const userConverter: FirestoreDataConverter<Address> = {
  toFirestore: function (modelObject: WithFieldValue<Address>): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): Address {
    const data: Address = {
      id: snapshot.id,
      ...snapshot.data(options),
    } as Address;
    return data;
  },
};

export default Address;
export { userConverter };
