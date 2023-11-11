import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import WithCreatedUpdated from './created_updated';
import WithId from './withId';
import Size from './size';

type ModelType = WithId & {
  name: string;
};

const modelTypeConverter: FirestoreDataConverter<ModelType> = {
  toFirestore: function (modelObject: WithFieldValue<ModelType>): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): ModelType {
    const data = snapshot.data(options);

    const convertedData: ModelType = {
      ...data,
      id: snapshot.id,
    } as ModelType;
    return convertedData;
  },
};

export default ModelType;

export { modelTypeConverter };
