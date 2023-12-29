import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';
import ProductType from './productType';
import Color from './color';
import Size from './size';

type CustomerReference = {
  uid: string;
  productTypeIds: ProductType['id'][];
  prices: {
    min: number;
    max: number;
  };
  colors: Color['name'][];
  sizes: Size['name'][];
};

const customerReferenceConverter: FirestoreDataConverter<CustomerReference> = {
  toFirestore: (obj: CustomerReference) => {
    // const { id, ...data } = obj;

    return obj;
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ) => {
    const data = snapshot.data(options);

    const object = {
      ...data,
      uid: snapshot.id,
    } as CustomerReference;

    return object;
  },
};

export default CustomerReference;
export type { CustomerReference };
export { customerReferenceConverter };
