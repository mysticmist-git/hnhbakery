import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import WithCreatedUpdated from './created_updated';
import WithActive from './withActive';
import WithId from './withId';

/**
 * Sale which come with some discount
 */
type Sale = WithCreatedUpdated &
  WithActive &
  WithId & {
    name: string;
    code: string;
    description: string;
    percent: number;
    limit: number;
    image: string;
    start_at: Date;
    end_at: Date;
    usedTurn: number;
    totalSalePrice: number;
    limitTurn: number;
    minBillTotalPrice: number;
    minRankId: string;
    public: boolean;
  };

const saleConverter: FirestoreDataConverter<Sale> = {
  toFirestore: function (modelObject: WithFieldValue<Sale>): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): Sale {
    const data = snapshot.data(options);

    const convertedData: Sale = {
      ...data,
      id: snapshot.id,
      start_at: data.start_at.toDate(),
      end_at: data.end_at.toDate(),
      created_at: data.created_at.toDate(),
      updated_at: data.updated_at.toDate(),
    } as Sale;
    return convertedData;
  },
};

export default Sale;
export { saleConverter };
export type { Sale };

export function InitSale() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const data: Sale = {
    id: '',
    name: '',
    code: '',
    description: '',
    percent: 0,
    limit: 0,
    image: '',
    start_at: new Date(),
    end_at: tomorrow,
    usedTurn: 0,
    limitTurn: 0,
    minBillTotalPrice: 0,
    totalSalePrice: 0,
    minRankId: '1',
    public: true,
    created_at: new Date(),
    updated_at: new Date(),
    active: true,
  };
  return data;
}
