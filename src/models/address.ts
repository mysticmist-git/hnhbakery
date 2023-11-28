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
 * Foreign Keys: user_id, province_id
 */
type Address = WithCreatedUpdated &
  WithId & {
    address: string;
    user_id: string;
    province_id: string;
  };

const addressConverter: FirestoreDataConverter<Address> = {
  toFirestore: function (modelObject: WithFieldValue<Address>): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): Address {
    const data = snapshot.data(options);

    const convertedData: Address = {
      ...data,
      id: snapshot.id,
      created_at: data.created_at.toDate(),
      updated_at: data.updated_at.toDate(),
    } as Address;
    return convertedData;
  },
};

export default Address;
export { addressConverter };
