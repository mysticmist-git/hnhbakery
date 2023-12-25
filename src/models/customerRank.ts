import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';

type CustomerRank = {
  id: string;
  name: string;
  minPaidMoney: number;
  maxPaidMoney: number;
  description: string;
  image: string;
};

const customerRankConverter: FirestoreDataConverter<CustomerRank> = {
  toFirestore: (obj: CustomerRank) => {
    return obj;
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ) => {
    const data = snapshot.data(options);

    const object = {
      ...data,
      id: snapshot.id,
    } as CustomerRank;

    return object;
  },
};

export default CustomerRank;
export { customerRankConverter };
