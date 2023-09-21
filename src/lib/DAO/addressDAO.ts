import Address, { addressConverter } from '@/models/address';
import Group from '@/models/group';
import { User } from 'firebase/auth';
import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  Query,
  QueryConstraint,
  QuerySnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';
import { getUserRef } from './userDAO';

export function getAddressesRef(
  userRef: DocumentReference<User>
): CollectionReference<Address>;
export function getAddressesRef(
  groupId: string,
  userId: string
): CollectionReference<Address>;
export function getAddressesRef(
  arg: string | DocumentReference<User>,
  userId?: string
): CollectionReference<Address> {
  if (typeof arg === 'string') {
    if (!userId) {
      throw new Error('Invalid argument');
    }

    return collection(
      getUserRef(arg, userId),
      COLLECTION_NAME.ADDRESSES
    ).withConverter(addressConverter);
  } else if (arg instanceof DocumentReference) {
    return collection(arg, COLLECTION_NAME.ADDRESSES).withConverter(
      addressConverter
    );
  } else {
    throw new Error('Invalid argument');
  }
}

export function getAddressesRefWithQuery(
  groupId: string,
  userId: string,
  ...queryConstraints: QueryConstraint[]
): Query<Address>;

export function getAddressesRefWithQuery(
  userRef: DocumentReference<User>,
  ...queryConstraints: QueryConstraint[]
): Query<Address>;

export function getAddressesRefWithQuery(
  arg1: string | DocumentReference<User>,
  arg2?: string | QueryConstraint,
  ...queryConstraints: QueryConstraint[]
): Query<Address> {
  if (typeof arg1 === 'string' && typeof arg2 === 'string') {
    const groupId = arg1;
    const userId = arg2;

    return query(getAddressesRef(groupId, userId), ...queryConstraints);
  } else if (arg1 instanceof DocumentReference) {
    const userRef = arg1;
    // implementation code for DocumentReference argument

    return query(getAddressesRef(userRef), ...queryConstraints);
  } else {
    throw new Error('Invalid arguments');
  }
}

export function getAddressRef(
  groupId: string,
  userId: string,
  id: string
): DocumentReference<Address>;
export function getAddressRef(
  userRef: DocumentReference<User>,
  id: string
): DocumentReference<Address>;
export function getAddressRef(
  arg1: string | DocumentReference<User>,
  arg2?: string,
  id?: string
): DocumentReference<Address> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2;

    if (!id || !userId) {
      throw new Error('Invalid argument');
    }

    return doc(getAddressesRef(groupId, userId), id).withConverter(
      addressConverter
    );
  } else if (arg1 instanceof DocumentReference) {
    const userRef = arg1;
    // implementation code for DocumentReference argument

    if (!id) {
      throw new Error('Invalid argument');
    }

    return doc(arg1, id).withConverter(addressConverter);
  } else {
    throw new Error('Invalid arguments');
  }
}

export async function getAddressesSnapshot(
  groupId: string,
  userId: string
): Promise<QuerySnapshot<Address>>;
export async function getAddressesSnapshot(
  userRef: DocumentReference<User>
): Promise<QuerySnapshot<Address>>;
export async function getAddressesSnapshot(
  arg1: string | DocumentReference<User>,
  arg2?: string
): Promise<QuerySnapshot<Address>> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2;

    if (!userId) {
      throw new Error('Invalid argument');
    }

    return getDocs(getAddressesRef(groupId, userId));
  } else if (arg1 instanceof DocumentReference) {
    const userRef = arg1;
    // implementation code for DocumentReference argument

    return getDocs(getAddressesRef(userRef));
  } else {
    throw new Error('Invalid arguments');
  }
}

export async function getAddresses(
  groupId: string,
  userId: string
): Promise<Address[]>;
export async function getAddresses(
  userRef: DocumentReference<User>
): Promise<Address[]>;
export async function getAddresses(
  arg1: string | DocumentReference<User>,
  arg2?: string
): Promise<Address[]> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2;

    if (!userId) {
      throw new Error('Invalid argument');
    }

    return (await getAddressesSnapshot(groupId, userId)).docs.map((doc) =>
      doc.data()
    );
  } else if (arg1 instanceof DocumentReference) {
    const userRef = arg1;
    // implementation code for DocumentReference argument

    return (await getAddressesSnapshot(userRef)).docs.map((doc) => doc.data());
  } else {
    throw new Error('Invalid arguments');
  }
}

export async function getAddressSnapshotById(
  groupId: string,
  userId: string,
  id: string
): Promise<DocumentSnapshot<Address>>;
export async function getAddressSnapshotById(
  userRef: DocumentReference<User>,
  id: string
): Promise<DocumentSnapshot<Address>>;
export async function getAddressSnapshotById(
  arg1: string | DocumentReference<User>,
  arg2: string,
  id?: string
): Promise<DocumentSnapshot<Address>> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2;

    if (!id || !userId) {
      throw new Error('Invalid argument');
    }

    return await getDoc(getAddressRef(groupId, userId, id));
  } else if (arg1 instanceof DocumentReference) {
    const userRef = arg1;
    // implementation code for DocumentReference argument

    if (!id) {
      throw new Error('Invalid argument');
    }

    return await getDoc(getAddressRef(userRef, id));
  } else {
    throw new Error('Invalid arguments');
  }
}

export async function getAddressById(
  groupId: string,
  userId: string,
  id: string
): Promise<Address | undefined>;
export async function getAddressById(
  userRef: DocumentReference<User>,
  id: string
): Promise<Address | undefined>;
export async function getAddressById(
  arg1: string | DocumentReference<User>,
  arg2: string,
  id?: string
): Promise<Address | undefined> {
  if (typeof arg1 === 'string') {
    const groupId: string = arg1;
    const userId: string = arg2;

    if (!id) {
      throw new Error('Invalid argument');
    }

    return (await getAddressSnapshotById(groupId, userId, id)).data();
  } else if (arg1 instanceof DocumentReference) {
    const userRef: DocumentReference<User> = arg1;

    if (!id) {
      throw new Error('Invalid argument');
    }

    return (await getAddressSnapshotById(userRef, id)).data();
  } else {
    throw new Error('Invalid arguments');
  }
}

export async function createAddress(
  groupId: string,
  userId: string,
  data: Address
): Promise<DocumentReference<Address>>;

export async function createAddress(
  userRef: DocumentReference<User>,
  data: Address
): Promise<DocumentReference<Address>>;

export async function createAddress(
  arg1: string | DocumentReference<User>,
  arg2: string | Address,
  data?: Address
): Promise<DocumentReference<Address>> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2 as string;

    if (!data) {
      throw new Error('Invalid argument');
    }

    return await addDoc(getAddressesRef(groupId, userId), data);
  } else if (arg1 instanceof DocumentReference) {
    const userRef = arg1 as DocumentReference<User>;
    // implementation code for DocumentReference argument

    if (!data) {
      throw new Error('Invalid argument');
    }

    return await addDoc(getAddressesRef(userRef), data);
  } else {
    throw new Error('Invalid arguments');
  }
}

export async function updateAddress(
  groupId: string,
  userId: string,
  data: Address
): Promise<void>;
export async function updateAddress(
  userRef: DocumentReference<User>,
  data: Address
): Promise<void>;
export async function updateAddress(
  arg1: string | DocumentReference<User>,
  arg2: string | Address,
  data?: Address
): Promise<void> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2 as string;

    if (!data) {
      throw new Error('Invalid argument');
    }

    await updateDoc(getAddressRef(groupId, userId, data.id), data);
  } else if (arg1 instanceof DocumentReference) {
    const userRef = arg1;
    // implementation code for DocumentReference argument

    if (!data) {
      throw new Error('Invalid argument');
    }

    await updateDoc(getAddressRef(userRef, data.id), data);
  } else {
    throw new Error('Invalid arguments');
  }
}
