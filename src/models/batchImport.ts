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
type BatchImport = WithId & {
  product_type_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  state: ImportState;
  branch_id: string;
  export_id: string | null;
  staff_id: string;
  staff_group_id: string;
  exchanged_batch: string | null;
  created_at: Date;
  updated_at: Date;
};

export type ImportState = 'issued' | 'pending' | 'success' | 'cancel';

const batchImportConverter: FirestoreDataConverter<BatchImport> = {
  toFirestore: function (
    modelObject: WithFieldValue<BatchImport>
  ): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): BatchImport {
    const data = snapshot.data(options);
    const convertedData: BatchImport = {
      ...data,
      id: snapshot.id,
      created_at: data.created_at.toDate(),
      updated_at: data.updated_at.toDate(),
    } as BatchImport;
    return convertedData;
  },
};

export default BatchImport;
export { batchImportConverter };
