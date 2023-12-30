import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import WithId from './withId';

/**
 * Imports
 */
type StockImport = WithId & {
  product_type_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  state: ImportState;
  branch_id: string;
  export_id: string | null;
  staff_id: string;
  staff_group_id: string;
  created_at: Date;
  updated_at: Date;
};

type ImportState = 'issued' | 'pending' | 'success' | 'cancel';

const importConverter: FirestoreDataConverter<StockImport> = {
  toFirestore: function (
    modelObject: WithFieldValue<StockImport>
  ): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): StockImport {
    const data = snapshot.data(options);
    const convertedData: StockImport = {
      ...data,
      id: snapshot.id,
      created_at: data.created_at.toDate(),
      updated_at: data.updated_at.toDate(),
    } as StockImport;
    return convertedData;
  },
};

export default StockImport;
export { importConverter };
