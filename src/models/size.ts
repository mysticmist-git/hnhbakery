import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';

/**
 * Size
 */
type Size = {
  id: string;
  name: string;
};

const sizeConverter: FirestoreDataConverter<Size> = {
  toFirestore: function (modelObject: WithFieldValue<Size>): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): Size {
    const data: Size = {
      id: snapshot.id,
      ...snapshot.data(options),
    } as Size;
    return data;
  },
};

export function SizeNameParse(name: string | undefined): string {
  if (!name) {
    return 'Trống';
  }
  if (name == 'lon') {
    return 'Lớn';
  } else if (name == 'nho') {
    return 'Nhỏ';
  } else if (name == 'vua') {
    return 'Vừa';
  }
  return name;
}

export default Size;

export { sizeConverter };
