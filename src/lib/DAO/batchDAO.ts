import { db } from '@/firebase/config';
import Batch, { BatchTableRow, batchConverter } from '@/models/batch';
import {
  QueryConstraint,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';
import { getAvailableProductTypeTableRows } from './productTypeDAO';

export function getBatchesRef() {
  return collection(db, COLLECTION_NAME.BATCHES).withConverter(batchConverter);
}

export function getBatchesQuery(...queryConstraints: QueryConstraint[]) {
  return query(getBatchesRef(), ...queryConstraints).withConverter(
    batchConverter
  );
}

export function getBatchRefById(id: string) {
  return doc(getBatchesRef(), id).withConverter(batchConverter);
}

export function getBatchesSnapshot() {
  return getDocs(getBatchesRef());
}

export async function getBatches() {
  return (await getBatchesSnapshot()).docs.map((doc) => doc.data());
}

export async function getBatchesSnapshotWithQuery(
  ...queryConstraints: QueryConstraint[]
) {
  const batchesSnapshot = await getDocs(getBatchesQuery(...queryConstraints));

  return batchesSnapshot;
}

export async function getBatchesWithQuery(
  ...queryConstraints: QueryConstraint[]
) {
  return (await getBatchesSnapshotWithQuery(...queryConstraints)).docs.map(
    (doc) => doc.data()
  );
}

export async function getBatchSnapshotById(id: string) {
  return await getDoc(getBatchRefById(id));
}

export async function getBatchById(id: string) {
  return (await getBatchSnapshotById(id)).data();
}

export async function createBatch(batch: Omit<Batch, 'id'>) {
  return await addDoc(getBatchesRef(), batch);
}

export async function updateBatch(id: string, batch: Omit<Batch, 'id'>) {
  await updateDoc(getBatchRefById(id), batch);
}

export async function increaseDecreaseBatchQuantity(
  id: string,
  quantity: number
) {
  await updateDoc(getBatchRefById(id), {
    quantity: increment(quantity),
    updated_at: new Date(),
  });
}

export async function deleteBatch(id: string) {
  await deleteDoc(getBatchRefById(id));
}

export async function getAvailableBatchById(id: string) {
  const batchSnapshot = await getBatchSnapshotById(id);
  const data = batchSnapshot.data();
  if (!data) {
    return undefined;
  }
  if (data.quantity - data.sold > 0 && new Date(data.exp) > new Date()) {
    return data;
  }
  return undefined;
}

export async function getAvailableBatches(onlyFirstBatch: boolean = false) {
  const productTypes = await getAvailableProductTypeTableRows();

  const finalBatches: BatchTableRow[] = [];
  for (let p of productTypes) {
    console.log(p);
    if (!p.products || p.products.length === 0) {
      continue;
    }
    for (let product of p.products) {
      console.log(product);
      if (!product.variants || product.variants.length === 0) {
        continue;
      }
      for (let v of product.variants) {
        console.log(v);
        if (!v.batches || v.batches.length === 0) {
          continue;
        }
        for (let b of v.batches) {
          console.log(b);
          const batch = await getAvailableBatchById(b);

          if (batch) {
            finalBatches.push({
              ...batch,
              productType: p,
              product: product,
              variant: v,
            });
          }
          if (onlyFirstBatch) {
            break;
          }
        }
      }
    }
  }

  return finalBatches;
}
