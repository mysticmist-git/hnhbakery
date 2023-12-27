import CustomerReference, {
  customerReferenceConverter,
} from '@/models/CustomerReference';
import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';
import { db } from '@/firebase/config';
import { BillTableRow } from '@/models/bill';

export function getCustomerReferencesRef(): CollectionReference<CustomerReference> {
  return collection(db, COLLECTION_NAME.CUSTOMER_REFERENCES).withConverter(
    customerReferenceConverter
  );
}

export function getCustomerReferenceRefById(
  id: string
): DocumentReference<CustomerReference> {
  return doc(getCustomerReferencesRef(), id).withConverter(
    customerReferenceConverter
  );
}

export async function getCustomerReferenceSnapshots(): Promise<
  QuerySnapshot<CustomerReference>
> {
  const collectionRef = getCustomerReferencesRef();
  return await getDocs(collectionRef);
}

export async function getCustomerReferences(): Promise<CustomerReference[]> {
  const snapshot = await getCustomerReferenceSnapshots();
  return snapshot.docs.map((doc) => doc.data());
}

export async function getCustomerReferenceSnapshot(
  uid: string
): Promise<DocumentSnapshot<CustomerReference>> {
  return await getDoc(getCustomerReferenceRefById(uid));
}

export async function getCustomerReference(
  uid: string
): Promise<CustomerReference | undefined> {
  return (await getCustomerReferenceSnapshot(uid)).data();
}

export async function updateCustomerReference(
  uid: string,
  data: Omit<CustomerReference, 'id'>
): Promise<void> {
  await updateDoc(getCustomerReferenceRefById(uid), data);
}

export async function createCustomerReference(data: CustomerReference) {
  return await setDoc(
    doc(db, COLLECTION_NAME.CUSTOMER_REFERENCES, data.uid).withConverter(
      customerReferenceConverter
    ),
    data
  );
}

export async function deleteCustomerReference(uid: string): Promise<void> {
  await deleteDoc(getCustomerReferenceRefById(uid));
}

export async function updateCustomerReferenceByBillTableRow(
  bill: BillTableRow
) {
  if (bill.customer && bill.billItems) {
    const customerReference = await getCustomerReference(bill.customer.uid);
    if (!customerReference) {
      return;
    }
    const billItems = bill.billItems;
    const productTypeIds: string[] = billItems
      .map((billItem) => billItem.productType?.id)
      .filter((id) => id !== undefined) as string[];

    const prices: number[] = billItems
      .map((billItem) => billItem.variant?.price)
      .filter((price) => price !== undefined) as number[];
    await updateCustomerReference(customerReference.uid, {
      ...customerReference,
      productTypeIds: Array.from(
        new Set([...customerReference.productTypeIds, ...productTypeIds])
      ),
      prices: {
        min:
          Math.min(...prices) < customerReference.prices.min
            ? Math.min(...prices)
            : customerReference.prices.min,
        max:
          Math.max(...prices) > customerReference.prices.max
            ? Math.max(...prices)
            : customerReference.prices.max,
      },
    });
  }
}
