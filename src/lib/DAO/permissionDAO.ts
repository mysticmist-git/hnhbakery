import { db } from '@/firebase/config';
import Permission, { permissionConverter } from '@/models/permission';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { COLLECTION_NAME } from '../constants';

async function getPermissions() {
  try {
    const collectionRef = collection(
      db,
      COLLECTION_NAME.PERMISSIONS
    ).withConverter(permissionConverter);

    const snapshot = await getDocs(collectionRef);

    const data = snapshot.docs.map((doc) => doc.data());

    return data;
  } catch (error) {
    console.log('[DAO] Fail to get collection', error);
  }
}

async function getPermissionById(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.PERMISSIONS, id).withConverter(
      permissionConverter
    );

    const snapshot = await getDoc(docRef);

    return snapshot.data();
  } catch (error) {
    console.log('[DAO] Fail to get doc', error);
  }
}

async function updatePermission(id: string, data: Permission) {
  try {
    const docRef = doc(db, COLLECTION_NAME.PERMISSIONS, id).withConverter(
      permissionConverter
    );

    await updateDoc(docRef, data);
  } catch (error) {
    console.log('[DAO] Fail to update doc', error);
  }
}

async function createPermission(data: Permission) {
  try {
    await addDoc(collection(db, COLLECTION_NAME.PERMISSIONS), data);
  } catch (error) {
    console.log('[DAO] Fail to create doc', error);
  }
}

async function deletePermission(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME.PERMISSIONS, id).withConverter(
      permissionConverter
    );

    await deleteDoc(docRef);
  } catch (error) {
    console.log('[DAO] Fail to delete doc', error);
  }
}

export {
  createPermission,
  deletePermission,
  getPermissionById,
  getPermissions,
  updatePermission,
};
