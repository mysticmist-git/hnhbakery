import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';
import WithCreatedUpdated from './created_updated';
import WithActive from './withActive';
import WithId from './withId';
import Variant from './variant';
import Feedback from './feedback';

/**
 * Product
 * Sub-Collections: variants, feedbacks
 * Foreign Keys: colors, product_type_id
 * Old foreign keys that I deleted: ingredients
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

type ProductTableRow = Product & {
  variants?: Variant[];
  feedbacks?: Feedback[];
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
      created_at: data.created_at.toDate(),
      updated_at: data.updated_at.toDate(),
    } as Product;

    return object;
  },
};

export default Product;
export type { Product, ProductTableRow };
export { productConverter };
