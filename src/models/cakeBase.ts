import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import WithId from './withId';

type CakeBase = WithId & {
  name: string;
  description: string;
  image: string;
};

const cakeBaseConverter: FirestoreDataConverter<CakeBase> = {
  toFirestore: function (modelObject: WithFieldValue<CakeBase>): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): CakeBase {
    const data: CakeBase = {
      id: snapshot.id,
      ...snapshot.data(options),
    } as CakeBase;
    return data;
  },
};
export default CakeBase;

export { cakeBaseConverter };
