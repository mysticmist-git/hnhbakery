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
 * A branch;
 * Foreign Keys: manager_id
 */
type Branch = WithCreatedUpdated &
  WithId & {
    address: string;
    manager_id: string;
    name: string;
  };

const branchConverter: FirestoreDataConverter<Branch> = {
  toFirestore: function (modelObject: WithFieldValue<Branch>): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): Branch {
    const data = snapshot.data(options);

    const convertedData: Branch = {
      ...data,
      id: snapshot.id,
      created_at: data.created_at.toDate(),
      updated_at: data.updated_at.toDate(),
    } as Branch;
    return convertedData;
  },
};

export default Branch;
export { branchConverter };
