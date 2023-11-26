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

type Model3DType = WithId & {
  name: string;
};

const modelTypeConverter: FirestoreDataConverter<Model3DType> = {
  toFirestore: function (
    modelObject: WithFieldValue<Model3DType>
  ): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): Model3DType {
    const data = snapshot.data(options);

    const convertedData: Model3DType = {
      ...data,
      id: snapshot.id,
    } as Model3DType;
    return convertedData;
  },
};

export default Model3DType;

export { modelTypeConverter };
