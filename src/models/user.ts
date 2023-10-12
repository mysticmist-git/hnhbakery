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
import { BillTableRow } from './bill';
import { FeedbackTableRow } from './feedback';
import Address from './address';

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
    type: 'google' | 'mail';
  };

type UserTableRow = User & {
  bills?: BillTableRow[];
  addresses?: Address[];
  feedbacks?: FeedbackTableRow[];
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
    const data = snapshot.data(options);

    const convertedData: User = {
      ...data,
      id: snapshot.id,
      created_at: data.created_at.toDate(),
      updated_at: data.updated_at.toDate(),
    } as User;
    return convertedData;
  },
};

export default User;
export type { User, UserTableRow };
export { userConverter };
