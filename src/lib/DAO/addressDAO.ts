import Address, { addressConverter } from '@/models/address';
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
  groupId: string,
  userId: string
): CollectionReference<Address>;
export function getAddressesRef(
  userRef: DocumentReference<User>
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
  addressesRef: CollectionReference<Address>,
  ...queryConstraints: QueryConstraint[]
): Query<Address>;
export function getAddressesRefWithQuery(
  arg1: string | DocumentReference<User> | CollectionReference<Address>,
  arg2?: string | QueryConstraint,
  ...queryConstraints: QueryConstraint[]
): Query<Address> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2 as string;

    return query(getAddressesRef(groupId, userId), ...queryConstraints);
  } else if (arg1 instanceof DocumentReference) {
    const userRef = arg1;

    return query(getAddressesRef(userRef), ...queryConstraints);
  } else {
    const addressesRef = arg1;
    // implementation code for DocumentReference argument

    return query(addressesRef, ...queryConstraints);
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
  addressesRef: CollectionReference<Address>,
  id: string
): DocumentReference<Address>;
export function getAddressRef(
  arg1: string | DocumentReference<User> | CollectionReference<Address>,
  arg2: string,
  id?: string
): DocumentReference<Address> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2 as string;

    return doc(getAddressesRef(groupId, userId), id).withConverter(
      addressConverter
    );
  } else if (arg1 instanceof DocumentReference) {
    const userRef = arg1;
    const id = arg2;

    return doc(getAddressesRef(userRef), id).withConverter(addressConverter);
  } else {
    const addressesRef = arg1;
    const id = arg2;

    return doc(addressesRef, id).withConverter(addressConverter);
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
  addressesRef: CollectionReference<Address>
): Promise<QuerySnapshot<Address>>;
export async function getAddressesSnapshot(
  arg1: string | DocumentReference<User> | CollectionReference<Address>,
  arg2?: string
): Promise<QuerySnapshot<Address>> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2 as string;

    return getDocs(getAddressesRef(groupId, userId));
  } else if (arg1 instanceof DocumentReference) {
    const userRef = arg1;

    return getDocs(getAddressesRef(userRef));
  } else {
    const addressesRef = arg1;

    return getDocs(addressesRef);
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
  } else {
    const userRef = arg1;
    // implementation code for DocumentReference argument

    return (await getAddressesSnapshot(userRef)).docs.map((doc) => doc.data());
  }
}

export async function getAddressSnapshot(
  groupId: string,
  userId: string,
  id: string
): Promise<DocumentSnapshot<Address>>;
export async function getAddressSnapshot(
  userRef: DocumentReference<User>,
  id: string
): Promise<DocumentSnapshot<Address>>;
export async function getAddressSnapshot(
  addressesRef: CollectionReference<Address>,
  id: string
): Promise<DocumentSnapshot<Address>>;
export async function getAddressSnapshot(
  arg1: string | DocumentReference<User> | CollectionReference<Address>,
  arg2: string,
  id?: string
): Promise<DocumentSnapshot<Address>> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2;

    return await getDoc(getAddressRef(groupId, userId, id!));
  } else if (arg1 instanceof DocumentReference) {
    const userRef = arg1;
    const id = arg2;

    return await getDoc(getAddressRef(userRef, id));
  } else {
    const addressesRef = arg1;

    return await getDoc(getAddressRef(addressesRef, id!));
  }
}

export async function getAddress(
  groupId: string,
  userId: string,
  id: string
): Promise<Address | undefined>;
export async function getAddress(
  userRef: DocumentReference<User>,
  id: string
): Promise<Address | undefined>;
export async function getAddress(
  addressesRef: CollectionReference<Address>,
  id: string
): Promise<Address | undefined>;
export async function getAddress(
  arg1: string | DocumentReference<User> | CollectionReference<Address>,
  arg2: string,
  id?: string
): Promise<Address | undefined> {
  if (typeof arg1 === 'string') {
    const groupId: string = arg1;
    const userId: string = arg2;

    if (!id) {
      throw new Error('Invalid argument');
    }

    return (await getAddressSnapshot(groupId, userId, id)).data();
  } else if (arg1 instanceof DocumentReference) {
    const userRef = arg1;

    return (await getDoc(getAddressRef(userRef, id!))).data();
  } else {
    const addressesRef = arg1;

    return (await getDoc(getAddressRef(addressesRef, id!))).data();
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
  billsRef: CollectionReference<Address>,
  data: Address
): Promise<DocumentReference<Address>>;
export async function createAddress(
  arg1: string | DocumentReference<User> | CollectionReference<Address>,
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
  } else if (arg1 instanceof CollectionReference) {
    const billsRef = arg1 as CollectionReference<Address>;
    const data = arg2 as Address;

    return await addDoc(billsRef, data);
  } else {
    const userRef = arg1 as DocumentReference<User>;
    // implementation code for DocumentReference argument

    if (!data) {
      throw new Error('Invalid argument');
    }

    return await addDoc(getAddressesRef(userRef), data);
  }
}

export async function updateAddress(
  groupId: string,
  userId: string,
  id: string,
  data: Address
): Promise<void>;
export async function updateAddress(
  userRef: DocumentReference<User>,
  id: string,
  data: Address
): Promise<void>;
export async function updateAddress(
  addressesRef: CollectionReference<Address>,
  id: string,
  data: Address
): Promise<void>;
export async function updateAddress(
  addressRef: DocumentReference<Address>,
  data: Address
): Promise<void>;
export async function updateAddress(
  arg1:
    | string
    | DocumentReference<User>
    | CollectionReference<Address>
    | DocumentReference<Address>,
  arg2: string | Address,
  arg3?: string | Address,
  arg4?: Address
): Promise<void> {
  if (typeof arg1 == 'string') {
    const groupId = arg1;
    const userId = arg2 as string;
    const id = arg3 as string;
    const data = arg4;

    await updateDoc(getAddressRef(groupId, userId, id), data);
  } else if (arg1 instanceof DocumentReference && typeof arg2 === 'string') {
    const userRef = arg1 as DocumentReference<User>;
    const id = arg2;
    const data = arg3 as Address;

    await updateDoc(getAddressRef(userRef, id), data);
  } else if (arg1 instanceof CollectionReference) {
    const addressesRef = arg1 as CollectionReference<Address>;
    const id = arg2 as string;
    const data = arg3 as Address;

    await updateDoc(getAddressRef(addressesRef, id), data);
  } else {
    const addressRef = arg1 as DocumentReference<Address>;
    const data = arg2 as Address;

    await updateDoc(addressRef, data);
  }
}

export async function updateAddressValue(
  userGroupId: string,
  userId: string,
  addressId: string,
  newAddress: string
) {
  const addressRef = getAddressRef(userGroupId, userId, addressId);
  await updateDoc(addressRef, { address: newAddress, updated_at: new Date() });
}

export async function deleteAddress(
  groupId: string,
  userId: string,
  id: string
): Promise<void>;
export async function deleteAddress(
  userRef: DocumentReference<User>,
  id: string
): Promise<void>;
export async function deleteAddress(
  addressesRef: CollectionReference<Address>,
  id: string
): Promise<void>;
export async function deleteAddress(
  addressRef: DocumentReference<Address>
): Promise<void>;
export async function deleteAddress(
  arg1:
    | string
    | DocumentReference<User>
    | CollectionReference<Address>
    | DocumentReference<Address>,
  arg2?: string,
  arg3?: string
): Promise<void> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const userId = arg2 as string;
    const id = arg3 as string;

    await deleteDoc(getAddressRef(groupId, userId, id));
  } else if (arg1 instanceof DocumentReference && arg2) {
    const userRef = arg1 as DocumentReference<User>;
    const id = arg2 as string;

    await deleteDoc(getAddressRef(userRef, id));
  } else if (arg1 instanceof CollectionReference) {
    const addressRef = arg1 as CollectionReference<Address>;
    const id = arg2 as string;

    await deleteDoc(getAddressRef(addressRef, id));
  } else {
    const addressRef = arg1 as DocumentReference<Address>;

    await deleteDoc(addressRef);
  }
}
