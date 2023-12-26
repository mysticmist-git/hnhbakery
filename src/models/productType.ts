import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';
import WithCreatedUpdated from './created_updated';
import { ProductTableRow } from './product';
import WithActive from './withActive';
import WithId from './withId';

/**
 * Product type
 * Sub-Collections: products
 */
type ProductType = WithCreatedUpdated &
  WithActive &
  WithId & {
    name: string;
    description: string;
    image: string;
  };

type ProductTypeTableRow = ProductType & {
  products?: ProductTableRow[];
};

const productTypeConverter: FirestoreDataConverter<ProductType> = {
  toFirestore: (obj: ProductType) => {
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
    } as ProductType;

    return object;
  },
};

export default ProductType;
export { productTypeConverter };
export type { ProductType, ProductTypeTableRow };
