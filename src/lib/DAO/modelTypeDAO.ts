import { db } from '@/firebase/config';
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
import Model3DType, { modelTypeConverter } from '@/models/modelType';

function getModelTypesRef() {
  return collection(db, COLLECTION_NAME.MODEL_3D_TYPES).withConverter(
    modelTypeConverter
  );
}

function getModelTypeRefById(id: string) {
  return doc(getModelTypesRef(), id).withConverter(modelTypeConverter);
}

async function getModelTypeSnapshot() {
  return await getDocs(getModelTypesRef());
}

async function getModelTypeSnapshotById(id: string) {
  return await getDoc(getModelTypeRefById(id));
}

async function getModelTypes() {
  return (await getModelTypeSnapshot()).docs.map((doc) => doc.data());
}

async function getModelTypeById(id: string) {
  return (await getModelTypeSnapshotById(id)).data();
}

async function updateModelType(id: string, data: Model3DType) {
  await updateDoc(getModelTypeRefById(id), data);
}

async function createModelType(data: Omit<Model3DType, 'id'>) {
  return await addDoc(getModelTypesRef(), data);
}

async function deleteModelType(id: string) {
  await deleteDoc(getModelTypeRefById(id));
}
