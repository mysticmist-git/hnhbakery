import { db } from '@/firebase/config';
import { COLLECTION_NAME } from '../constants';
import Branch, { BranchTableRow, branchConverter } from '@/models/branch';
import {
  DocumentReference,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { getUser } from './userDAO';
import User from '@/models/user';

export function getBranchesRef() {
  return collection(db, COLLECTION_NAME.BRANCHES).withConverter(
    branchConverter
  );
}

export function getBranchRefById(id: string) {
  return doc(db, COLLECTION_NAME.BRANCHES, id).withConverter(branchConverter);
}

export async function getBranchesSnapshot() {
  return await getDocs(getBranchesRef());
}

export async function getBranches() {
  return (await getBranchesSnapshot()).docs.map((doc) => doc.data());
}

export async function getBranchSnapshotById(id: string) {
  return await getDoc(getBranchRefById(id));
}

export async function getBranchById(id: string) {
  return (await getBranchSnapshotById(id)).data();
}

export async function createBranch(data: Omit<Branch, 'id'>) {
  const docRef = await addDoc(getBranchesRef(), data);
  return docRef.id;
}

export async function updateBranch(id: string, data: Branch): Promise<void>;
export async function updateBranch(
  docRef: DocumentReference<Branch>,
  data: Branch
): Promise<void>;
export async function updateBranch(
  arg: string | DocumentReference<Branch>,
  data: Branch
): Promise<void> {
  if (typeof arg === 'string') {
    await updateDoc(getBranchRefById(arg), data);
  } else {
    await updateDoc(arg, data);
  }
}

export async function deleteBranch(id: string): Promise<void>;
export async function deleteBranch(
  docRef: DocumentReference<Branch>
): Promise<void>;
export async function deleteBranch(
  arg: string | DocumentReference<Branch>
): Promise<void> {
  if (typeof arg === 'string') {
    await deleteDoc(getBranchRefById(arg));
  } else {
    await deleteDoc(arg);
  }
}

export async function getBranchTableRows() {
  try {
    const finalData: BranchTableRow[] = [];
    const branches = await getBranches();
    for (let b of branches) {
      const user =
        b.manager_id == ''
          ? undefined
          : await getUser(b.group_id, b.manager_id);
      finalData.push({
        ...b,
        manager: user,
      });
    }
    return finalData;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getBranchByManager(manager: User) {
  const branches = await getBranches();
  return branches.find(
    (b) => b.manager_id == manager.id && b.group_id == manager.group_id
  );
}
