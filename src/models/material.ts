import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import WithId from './withId';

/**
 * Material of the product
 */
type Material = WithId & {
  name: string;
};

const materialConverter: FirestoreDataConverter<Material> = {
  toFirestore: function (modelObject: WithFieldValue<Material>): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): Material {
    const data: Material = {
      id: snapshot.id,
      ...snapshot.data(options),
    } as Material;
    return data;
  },
};

export default Material;
export { materialConverter };
