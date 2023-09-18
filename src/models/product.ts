import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';
import WithCreatedUpdated from './created_updated';
import WithActive from './withActive';
import WithId from './withId';

/**
 * Product
 * Sub-Collections: variants, feedbacks
 * Foreign Keys: ingredients, colors, product_type_id
 */
type Product = WithCreatedUpdated &
  WithActive &
  WithId & {
    name: string;
    description: string;
    ingredients: string[];
    colors: string[];
    how_to_use: string;
    preservation: string;
    images: string[];
    product_type_id: string;
  };

const productConverter: FirestoreDataConverter<Product> = {
  toFirestore: (obj: Product) => {
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
    } as Product;

    return object;
  },
};

export default Product;
export { productConverter };
