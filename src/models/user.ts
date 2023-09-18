import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import WithCreatedUpdated from './created_updated';
import WithActive from './withActive';
import WithId from './withId';

/**
 * Stores data about a User
 * Sub-Collections: addresses, bills
 * Foreign Keys: group_id
 */
type User = WithCreatedUpdated &
  WithActive &
  WithId & {
    uid: string;
    name: string;
    tel: string;
    birth: Date;
    mail: string;
    avatar: string;
    group_id: string;
  };

const userConverter: FirestoreDataConverter<User> = {
  toFirestore: function (modelObject: WithFieldValue<User>): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): User {
    const data: User = {
      id: snapshot.id,
      ...snapshot.data(options),
    } as User;
    return data;
  },
};

export default User;
export { userConverter };
