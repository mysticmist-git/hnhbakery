import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';
import WithId from './withId';

/**
 * Product
 */
type Ingredient = WithId & {
  name: string;
};

const ingredientConverter: FirestoreDataConverter<Ingredient> = {
  toFirestore: (obj: Ingredient) => {
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
    } as Ingredient;

    return object;
  },
};

export default Ingredient;
export { ingredientConverter };
