import Group from '@/models/group';
import User, { UserTableRow, userConverter } from '@/models/user';
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
  where,
} from 'firebase/firestore';

import { COLLECTION_NAME } from '../constants';
import {
  DEFAULT_GROUP_ID,
  getGroupRefById,
  getGroupsRef,
  getGroupsSnapshot,
  getGroupsSnapshotWithQuery,
} from './groupDAO';
import { BillTableRow } from '@/models/bill';
import { getBills } from './billDAO';
import { getBillItems } from './billItemDAO';
import { getBatchById } from './batchDAO';
import { getProductTypeById, getProductTypes } from './productTypeDAO';
import { getProduct, getProducts } from './productDAO';
import { getVariant } from './variantDAO';
import { getSaleById } from './saleDAO';
import { getDeliveryById } from './deliveryDAO';
import { getPaymentMethodById } from './paymentMethodDAO';
import { getAddress, getAddresses } from './addressDAO';
import { FeedbackTableRow } from '@/models/feedback';
import { getFeedbacks } from './feedbackDAO';

export function getUsersRef(
  groupRef: DocumentReference<Group>
): CollectionReference<User>;
export function getUsersRef(groupId: string): CollectionReference<User>;
export function getUsersRef(
  arg: string | DocumentReference<Group>
): CollectionReference<User> {
  if (typeof arg === 'string') {
    return collection(
      getGroupRefById(arg),
      COLLECTION_NAME.USERS
    ).withConverter(userConverter);
  } else {
    return collection(arg, COLLECTION_NAME.USERS).withConverter(userConverter);
  }
}

export function getUsersRefWithQuery(
  groupRef: DocumentReference<Group>,
  ...queryConstraints: QueryConstraint[]
): Query<User>;
export function getUsersRefWithQuery(
  groupId: string,
  ...queryConstraints: QueryConstraint[]
): Query<User>;
export function getUsersRefWithQuery(
  arg: string | DocumentReference<Group>,
  ...queryConstraints: QueryConstraint[]
): Query<User> {
  if (typeof arg === 'string') {
    return query(getUsersRef(arg), ...queryConstraints);
  } else {
    return query(getUsersRef(arg), ...queryConstraints);
  }
}

export function getUserRef(
  groupId: string,
  id: string
): DocumentReference<User>;
export function getUserRef(
  groupRef: DocumentReference<Group>,
  id: string
): DocumentReference<User>;
export function getUserRef(
  arg: string | DocumentReference<Group>,
  id: string
): DocumentReference<User> {
  if (typeof arg === 'string') {
    return doc(getUsersRef(arg), id);
  } else {
    return doc(arg, id).withConverter(userConverter);
  }
}

export async function getUsersSnapshot(
  groupId: string
): Promise<QuerySnapshot<User>>;
export async function getUsersSnapshot(
  groupRef: DocumentReference<Group>
): Promise<QuerySnapshot<User>>;
export async function getUsersSnapshot(
  arg: string | DocumentReference<Group>
): Promise<QuerySnapshot<User>> {
  if (typeof arg === 'string') {
    return await getDocs(getUsersRef(arg));
  } else {
    return await getDocs(getUsersRef(arg));
  }
}

export async function getUsers(groupId: string): Promise<User[]>;
export async function getUsers(
  groupRef: DocumentReference<Group>
): Promise<User[]>;
export async function getUsers(
  arg: string | DocumentReference<Group>
): Promise<User[]> {
  if (typeof arg === 'string') {
    return (await getUsersSnapshot(arg)).docs.map((doc) => doc.data());
  } else {
    return (await getUsersSnapshot(arg)).docs.map((doc) => doc.data());
  }
}

export async function getDefaultUsersSnapshot(): Promise<QuerySnapshot<User>> {
  return await getUsersSnapshot(DEFAULT_GROUP_ID);
}

export async function getDefaultUsers(): Promise<User[]> {
  return await getUsers(DEFAULT_GROUP_ID);
}

export async function getUsersSnapshotWithQuery(
  groupId: string,
  ...queryConstraints: QueryConstraint[]
): Promise<QuerySnapshot<User>>;
export async function getUsersSnapshotWithQuery(
  groupRef: DocumentReference<Group>,
  ...queryConstraints: QueryConstraint[]
): Promise<QuerySnapshot<User>>;
export async function getUsersSnapshotWithQuery(
  arg: string | DocumentReference<Group>,
  ...queryConstraints: QueryConstraint[]
): Promise<QuerySnapshot<User>> {
  if (typeof arg === 'string') {
    return await getDocs(getUsersRefWithQuery(arg, ...queryConstraints));
  } else {
    return await getDocs(getUsersRefWithQuery(arg, ...queryConstraints));
  }
}

export async function getUsersWithQuery(
  groupId: string,
  ...queryConstraints: QueryConstraint[]
): Promise<User[]>;
export async function getUsersWithQuery(
  groupRef: DocumentReference<Group>,
  ...queryConstraints: QueryConstraint[]
): Promise<User[]>;
export async function getUsersWithQuery(
  arg: string | DocumentReference<Group>,
  ...queryConstraints: QueryConstraint[]
): Promise<User[]> {
  if (typeof arg === 'string') {
    return (await getUsersSnapshotWithQuery(arg, ...queryConstraints)).docs.map(
      (doc) => doc.data()
    );
  } else {
    return (await getUsersSnapshotWithQuery(arg, ...queryConstraints)).docs.map(
      (doc) => doc.data()
    );
  }
}

export async function getUserSnapshot(
  groupId: string,
  id: string
): Promise<DocumentSnapshot<User>>;
export async function getUserSnapshot(
  groupRef: DocumentReference<Group>,
  id: string
): Promise<DocumentSnapshot<User>>;
export async function getUserSnapshot(
  arg: string | DocumentReference<Group>,
  id: string
): Promise<DocumentSnapshot<User>> {
  if (typeof arg === 'string') {
    return await getDoc(getUserRef(arg, id));
  } else {
    return await getDoc(getUserRef(arg, id));
  }
}

export async function getUser(
  groupId: string,
  id: string
): Promise<User | undefined>;
export async function getUser(
  groupRef: DocumentReference<Group>,
  id: string
): Promise<User | undefined>;
export async function getUser(
  arg: string | DocumentReference<Group>,
  id: string
): Promise<User | undefined> {
  if (typeof arg === 'string') {
    return (await getUserSnapshot(arg, id)).data();
  } else {
    return (await getUserSnapshot(arg, id)).data();
  }
}

export async function getUserRefByUid(
  uid: string
): Promise<DocumentReference<User> | undefined> {
  const groupsSnapshot = await getGroupsSnapshot();

  for (let groupSnapshot of groupsSnapshot.docs) {
    const matchUsers = await getUsersSnapshotWithQuery(
      groupSnapshot.id,
      where('uid', '==', uid)
    );

    if (matchUsers.empty) continue;

    return matchUsers.docs[0].ref;
  }
}

export async function getUserSnapshotByUid(
  uid: string
): Promise<DocumentSnapshot<User> | undefined> {
  const userRef = await getUserRefByUid(uid);

  if (!userRef) return undefined;

  return await getDoc(userRef);
}

export async function getUserByUid(uid: string): Promise<User | undefined> {
  const snapshot = await getUserSnapshotByUid(uid);

  if (!snapshot) return undefined;

  return snapshot.data();
}

export async function updateUser(
  groupId: string,
  id: string,
  data: User
): Promise<void>;
export async function updateUser(
  groupRef: DocumentReference<Group>,
  id: string,
  data: User
): Promise<void>;
export async function updateUser(
  userRef: DocumentReference<User>,
  data: User
): Promise<void>;
export async function updateUser(
  arg1: string | DocumentReference<Group> | DocumentReference<User>,
  arg2: string | User,
  data?: User
): Promise<void> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const id = arg2 as string;

    await updateDoc(getUserRef(groupId, id), data);
  } else if (arg1 instanceof DocumentReference && typeof arg2 === 'string') {
    const groupRef = arg1 as DocumentReference<Group>;
    const id = arg2 as string;

    await updateDoc(getUserRef(groupRef, id), data);
  } else {
    const userRef = arg1 as DocumentReference<User>;

    await updateDoc(userRef, data);
  }
}

export async function createUser(
  groupId: string,
  data: Omit<User, 'id'>
): Promise<DocumentReference<User>>;
export async function createUser(
  groupRef: DocumentReference<Group>,
  data: Omit<User, 'id'>
): Promise<DocumentReference<User>>;
export async function createUser(
  arg: string | DocumentReference<Group>,
  data: Omit<User, 'id'>
): Promise<DocumentReference<User>> {
  const collectionRef =
    typeof arg === 'string' ? getUsersRef(arg) : getUsersRef(arg);

  return (await addDoc(collectionRef, data)).withConverter(userConverter);
}

export async function deleteUser(groupId: string, id: string): Promise<void>;
export async function deleteUser(
  groupRef: DocumentReference<Group>,
  id: string
): Promise<void>;
export async function deleteUser(
  userRef: DocumentReference<User>
): Promise<void>;
export async function deleteUser(
  arg1: string | DocumentReference<Group> | DocumentReference<User>,
  arg2?: string
): Promise<void> {
  if (typeof arg1 === 'string') {
    const groupId = arg1;
    const id = arg2 as string;

    await deleteDoc(getUserRef(groupId, id));
  } else if (arg1 instanceof DocumentReference && arg2) {
    const groupRef = arg1 as DocumentReference<Group>;
    const id = arg2 as string;

    await deleteDoc(getUserRef(groupRef, id));
  } else {
    const userRef = arg1 as DocumentReference<User>;

    await deleteDoc(userRef);
  }
}

export async function getUserTableRows() {
  const finalUsers: UserTableRow[] = [];
  const customers = await getUsers(DEFAULT_GROUP_ID);

  for (let c of customers) {
    const billTableRows: BillTableRow[] = [];
    const bills = await getBills(c.group_id, c.id);
    for (let b of bills) {
      const billitems = await getBillItems(c.group_id, c.id, b.id);

      const billItems: BillTableRow['billItems'] = [];
      for (let bi of billitems) {
        const batch = await getBatchById(bi.batch_id);
        billItems.push({
          ...bi,
          batch: batch,
          productType: await getProductTypeById(batch!.product_type_id),
          product: await getProduct(batch!.product_type_id, batch!.product_id),
          variant: await getVariant(
            batch!.product_type_id,
            batch!.product_id,
            batch!.variant_id
          ),
        });
      }

      const sale = b.sale_id == '' ? undefined : await getSaleById(b.sale_id);

      const delivery = await getDeliveryById(b.delivery_id);

      billTableRows.push({
        ...b,
        paymentMethod: await getPaymentMethodById(b.payment_method_id),
        customer: { ...c },
        sale: sale,
        deliveryTableRow: {
          ...delivery!,
          address: await getAddress(c.group_id, c.id, delivery!.address_id),
        },
        billItems: billItems,
      });
    }

    const addresses = await getAddresses(c.group_id, c.id);

    const feedbackTableRows: FeedbackTableRow[] = [];
    const productTypes = await getProductTypes();

    for (let p of productTypes) {
      const products = await getProducts(p.id);
      for (let product of products) {
        const feedbacks = await getFeedbacks(p.id, product.id);
        for (let feedback of feedbacks) {
          if (feedback.user_id != c.id) {
            continue;
          }
          feedbackTableRows.push({
            ...feedback,
            product: product,
            user: { ...c },
          });
        }
      }
    }

    finalUsers.push({
      ...c,
      bills: billTableRows,
      addresses: addresses,
      feedbacks: feedbackTableRows,
    });
  }

  return finalUsers;
}

export async function getUserTableRowByUID(uid: string) {
  let finalUser: UserTableRow | undefined = undefined;

  const c = await getUserByUid(uid);

  if (!c) {
    return finalUser;
  }

  let billTableRows: BillTableRow[] = [];
  const bills = await getBills(c.group_id, c.id);
  for (let b of bills) {
    const billitems = await getBillItems(c.group_id, c.id, b.id);

    const billItems: BillTableRow['billItems'] = [];
    for (let bi of billitems) {
      const batch = await getBatchById(bi.batch_id);
      billItems.push({
        ...bi,
        batch: batch,
        productType: await getProductTypeById(batch!.product_type_id),
        product: await getProduct(batch!.product_type_id, batch!.product_id),
        variant: await getVariant(
          batch!.product_type_id,
          batch!.product_id,
          batch!.variant_id
        ),
      });
    }

    const sale = b.sale_id == '' ? undefined : await getSaleById(b.sale_id);

    const delivery = await getDeliveryById(b.delivery_id);

    billTableRows.push({
      ...b,
      paymentMethod: await getPaymentMethodById(b.payment_method_id),
      customer: { ...c },
      sale: sale,
      deliveryTableRow: {
        ...delivery!,
        address: await getAddress(c.group_id, c.id, delivery!.address_id),
      },
      billItems: billItems,
    });
  }

  const addresses = await getAddresses(c.group_id, c.id);

  const feedbackTableRows: FeedbackTableRow[] = [];
  const productTypes = await getProductTypes();

  for (let p of productTypes) {
    const products = await getProducts(p.id);
    for (let product of products) {
      const feedbacks = await getFeedbacks(p.id, product.id);
      for (let feedback of feedbacks) {
        if (feedback.user_id != c.id) {
          continue;
        }
        feedbackTableRows.push({
          ...feedback,
          product: product,
          user: { ...c },
        });
      }
    }
  }

  billTableRows = billTableRows.sort((a, b) =>
    a.created_at > b.created_at ? -1 : 1
  );

  finalUser = {
    ...c,
    bills: billTableRows,
    addresses: addresses,
    feedbacks: feedbackTableRows,
  };

  return finalUser;
}
