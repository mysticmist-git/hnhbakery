import { COLLECTION_NAME } from '@/lib/constants';
import { Dispatch } from 'react';
import {
  deleteImageFromFirebaseStorage,
  updateDocToFirestore,
  uploadImageToFirebaseStorage,
} from '../firestore/firestoreLib';
import {
  ManageAction,
  ManageActionType,
  ModalProductTypeObject,
} from '../localLib/manage';
import BaseObject from '../models/BaseObject';
import { createProductTypeObject } from '../models/ProductType';

export interface UpdateData {
  newData: BaseObject;
  originalData: BaseObject;
}

export interface ProductTypeUpdateData extends UpdateData {
  imageFile: File;
}

export interface DataManagerStrategy {
  dispatch: React.Dispatch<ManageAction>;
  addDoc(doc: BaseObject): void;
  updateDoc(updateData: UpdateData): Promise<BaseObject>;
  deleteDoc(id: string): void;
}

export class ProductTypeDataManagerStrategy implements DataManagerStrategy {
  dispatch: React.Dispatch<ManageAction>;

  constructor(dispatch: React.Dispatch<ManageAction>) {
    this.dispatch = dispatch;
  }

  addDoc(doc: BaseObject): void {
    throw new Error('Method not implemented.');
  }

  async updateDoc(updateData: UpdateData): Promise<BaseObject> {
    const productTypeUpdateData = { ...updateData } as ProductTypeUpdateData;

    const data = createProductTypeObject(productTypeUpdateData.newData);
    const originalData = createProductTypeObject(
      productTypeUpdateData.originalData
    );

    try {
      if (
        (productTypeUpdateData.newData as ModalProductTypeObject).imageURL !==
        (productTypeUpdateData.originalData as ModalProductTypeObject).imageURL
      ) {
        const newImagePath = await uploadImageToFirebaseStorage(
          productTypeUpdateData.imageFile
        );

        data.image = newImagePath;

        deleteImageFromFirebaseStorage(originalData.image);
      }

      updateDocToFirestore(data, COLLECTION_NAME.PRODUCT_TYPES);

      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  deleteDoc(id: string): void {
    throw new Error('Method not implemented.');
  }
}
