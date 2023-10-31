import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';

type CakeOccasion = {
  id: string;
  name: string;
};

const cakeOccasionConverter: FirestoreDataConverter<CakeOccasion> = {
  toFirestore: function (
    modelObject: WithFieldValue<CakeOccasion>
  ): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): CakeOccasion {
    const data: CakeOccasion = {
      id: snapshot.id,
      ...snapshot.data(options),
    } as CakeOccasion;
    return data;
  },
};

export default CakeOccasion;

export { cakeOccasionConverter };
