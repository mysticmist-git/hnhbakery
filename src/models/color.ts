import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import WithId from './withId';

/**
 * Color
 */
type Color = WithId & {
  value: string;
  hex: string;
  name: string;
};

const colorConverter: FirestoreDataConverter<Color> = {
  toFirestore: function (modelObject: WithFieldValue<Color>): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): Color {
    const data: Color = {
      id: snapshot.id,
      ...snapshot.data(options),
    } as Color;
    return data;
  },
};

export default Color;
export { colorConverter };
