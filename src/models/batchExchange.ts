import {
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import BatchExport from './batchExport';
import BatchImport from './batchImport';
import WithId from './withId';

/**
 * Exchanges
 */
type BatchExchange = WithId & {
  imports: DocumentReference<BatchImport>[];
  exports: DocumentReference<BatchExport>[];
};

const batchExchangeConverter: FirestoreDataConverter<BatchExchange> = {
  toFirestore: function (
    modelObject: WithFieldValue<BatchExchange>
  ): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): BatchExchange {
    const data: BatchExchange = {
      ...snapshot.data(options),
      id: snapshot.id,
    } as BatchExchange;
    return data;
  },
};

export default BatchExchange;
export { batchExchangeConverter };
