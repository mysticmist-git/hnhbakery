import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import WithId from './withId';

type CakeTexture = WithId & {
  name: string;
  description: string;
  image: string;
};

const cakeTextureConverter: FirestoreDataConverter<CakeTexture> = {
  toFirestore: function (
    modelObject: WithFieldValue<CakeTexture>
  ): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): CakeTexture {
    const data: CakeTexture = {
      id: snapshot.id,
      ...snapshot.data(options),
    } as CakeTexture;
    return data;
  },
};
export default CakeTexture;

export { cakeTextureConverter };
