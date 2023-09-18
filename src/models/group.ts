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
 * User Group
 * Sub-Collections: users
 * Foreign Keys: permissions
 */
type Group = WithCreatedUpdated &
  WithActive &
  WithId & {
    name: string;
    permissions: string[];
  };

const groupConverter: FirestoreDataConverter<Group> = {
  toFirestore: function (modelObject: WithFieldValue<Group>): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): Group {
    const data: Group = {
      id: snapshot.id,
      ...snapshot.data(options),
    } as Group;
    return data;
  },
};

export default Group;
export { groupConverter };
