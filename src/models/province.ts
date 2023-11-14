import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';
import WithId from './withId';

/**
 * Province
 */
type Province = WithId & {
  name: string;
};

const provinceConverter: FirestoreDataConverter<Province> = {
  toFirestore: (obj: Province) => {
    const { id, ...data } = obj;

    return data;
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ) => {
    const data = snapshot.data(options);

    const object = {
      ...data,
      id: snapshot.id,
    } as Province;

    return object;
  },
};

export default Province;
export { provinceConverter };
