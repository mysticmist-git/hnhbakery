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
  image: string;
  orderAppear: number;
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
  if (name == 'lon' || name == 'lớn' || name == 'Lớn') {
    return 'Lớn';
  } else if (name == 'nho' || name == 'nhỏ' || name == 'Nhỏ') {
    return 'Nhỏ';
  } else if (name == 'vua' || name == 'vừa' || name == 'Vừa') {
    return 'Vừa';
  }
  return name;
}

export default Size;

export { sizeConverter };
