import { COLLECTION_NAME } from '@/lib/constants';
import {
  StorageProductTypeObject,
  addDocToFirestore,
  deleteDocFromFirestore,
  deleteImageFromFirebaseStorage,
  getDocFromDocRef,
  getDownloadUrlFromFirebaseStorage,
  updateDocToFirestore,
  uploadImageToFirebaseStorage,
} from '../firestore/firestoreLib';
import { ManageAction, ModalProductTypeObject } from '../localLib/manage';
import BaseObject from '../models/BaseObject';
import {
  ProductTypeObject,
  createProductTypeObject,
} from '../models/ProductType';

export enum DataManagerErrorCode {
  NULL_FIELD = 'null-field',
  NULL_ADD_DATA = 'null-data-data',
  NULL_DATA = 'null-data',
}

//#region Add

export interface AddData {
  data: BaseObject;
}

export interface ProductTypeAddData extends AddData {
  imageFile?: File;
}

//#endregion

//#region Update

export interface UpdateData {
  newData: BaseObject;
  originalData: BaseObject;
}

export interface ProductTypeUpdateData extends UpdateData {
  imageFile: File;
}

//#endregion

export interface DataManagerStrategy {
  dispatch: React.Dispatch<ManageAction>;
  addDoc(addData: AddData): Promise<BaseObject>;
  updateDoc(updateData: UpdateData): Promise<BaseObject>;
  deleteDoc(doc: BaseObject): void;
}

export class ProductTypeDataManagerStrategy implements DataManagerStrategy {
  dispatch: React.Dispatch<ManageAction>;

  constructor(dispatch: React.Dispatch<ManageAction>) {
    this.dispatch = dispatch;
  }

  async addDoc(addData: AddData): Promise<BaseObject> {
    if (!addData) throw new Error(DataManagerErrorCode.NULL_ADD_DATA);

    const productTypeAddData = addData as ProductTypeAddData;

    if (!productTypeAddData.data)
      throw new Error(DataManagerErrorCode.NULL_DATA);

    const data = createProductTypeObject(productTypeAddData.data);

    if (!data.name) throw new Error(DataManagerErrorCode.NULL_FIELD);

    let image: string = '';
    if (productTypeAddData.imageFile)
      image = await uploadImageToFirebaseStorage(productTypeAddData.imageFile);

    data.image = image;

    const newProductTypeRef = await addDocToFirestore(
      data,
      COLLECTION_NAME.PRODUCT_TYPES
    );

    const refetchData = await getDocFromDocRef<ProductTypeObject>(
      newProductTypeRef
    );

    let imageURL = '';
    if (refetchData.image)
      imageURL = await getDownloadUrlFromFirebaseStorage(refetchData.image);

    const refinedData: ModalProductTypeObject = {
      ...refetchData,
      productCount: 0,
      imageURL: imageURL,
    };

    return refinedData;
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

        if (originalData.image)
          deleteImageFromFirebaseStorage(originalData.image);
      }

      updateDocToFirestore(data, COLLECTION_NAME.PRODUCT_TYPES);

      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  deleteDoc(doc: BaseObject): void {
    if (!doc) {
      console.log('Null doc');
      throw new Error('Null doc');
    }

    if (!doc.id) {
      console.log('Null id');
      throw new Error('Null id');
    }

    const castedDoc = doc as StorageProductTypeObject;

    if (castedDoc.image) deleteImageFromFirebaseStorage(castedDoc.image);

    deleteDocFromFirestore(COLLECTION_NAME.PRODUCT_TYPES, doc.id);
  }
}
