import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import WithId from './withId';

/**
 * Exports
 */
type BatchExport = WithId & {
  batch_id: string;
  state: ExportState;
  branch_id: string;
  import_id: string;
  quantity: number;
  staff_id: string;
  staff_group_id: string;
  created_at: Date;
  updated_at: Date;
};

export type ExportState = 'pending' | 'success';

const batchExportConverter: FirestoreDataConverter<BatchExport> = {
  toFirestore: function (
    modelObject: WithFieldValue<BatchExport>
  ): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): BatchExport {
    const data = snapshot.data(options);
    const convertedData: BatchExport = {
      ...data,
      id: snapshot.id,
      created_at: data.created_at.toDate(),
      updated_at: data.updated_at.toDate(),
    } as BatchExport;
    return convertedData;
  },
};

export default BatchExport;
export { batchExportConverter };
