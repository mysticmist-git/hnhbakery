import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import WithId from './withId';

type Model3d = WithId & {
  model_type_id: string;
  name: string;
  description?: string;
  file: string;
  image?: string;
};

const model3dConverter: FirestoreDataConverter<Model3d> = {
  toFirestore: function (modelObject: WithFieldValue<Model3d>): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): Model3d {
    const data = snapshot.data(options);

    const convertedData: Model3d = {
      ...data,
      id: snapshot.id,
    } as Model3d;
    return convertedData;
  },
};

export default Model3d;

export { model3dConverter };
