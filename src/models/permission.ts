import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import WithId from './withId';

/**
 * Represents a permission
 */
type Permission = WithId & {
  name: string;
  description: string;
  code: string;
};

const permissionConverter: FirestoreDataConverter<Permission> = {
  toFirestore: function (
    modelObject: WithFieldValue<Permission>
  ): DocumentData {
    const { id, ...obj } = modelObject;

    return obj;
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): Permission {
    const data: Permission = {
      id: snapshot.id,
      ...snapshot.data(options),
    } as Permission;
    return data;
  },
};

export default Permission;
export { permissionConverter };
