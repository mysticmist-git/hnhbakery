import { COLLECTION_NAME } from '@/lib/constants';
import {
  addDocToFirestore,
  deleteDocFromFirestore,
  deleteImageFromFirebaseStorage,
  getDocFromDocRef,
  getDocFromDocumentSnapshot,
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

//#region Add

export interface AddData {
  data: BaseObject;
}

export interface ProductTypeAddData extends AddData {
  imageFile: File;
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
  deleteDoc(id: string): void;
}

export class ProductTypeDataManagerStrategy implements DataManagerStrategy {
  dispatch: React.Dispatch<ManageAction>;

  constructor(dispatch: React.Dispatch<ManageAction>) {
    this.dispatch = dispatch;
  }

  async addDoc(addData: AddData): Promise<BaseObject> {
    if (!addData) throw new Error('addData is null');

    const productTypeAddData = addData as ProductTypeAddData;

    if (!productTypeAddData.data || !productTypeAddData.imageFile)
      throw new Error('productTypeAddData is null');

    const data = createProductTypeObject(productTypeAddData.data);
    const image = await uploadImageToFirebaseStorage(
      productTypeAddData.imageFile
    );

    data.image = image;

    const newProductTypeRef = await addDocToFirestore(
      data,
      COLLECTION_NAME.PRODUCT_TYPES
    );

    const refetchData = await getDocFromDocRef<ProductTypeObject>(
      newProductTypeRef
    );

    const refinedData: ModalProductTypeObject = {
      ...refetchData,
      productCount: 0,
      imageURL: await getDownloadUrlFromFirebaseStorage(refetchData.image),
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

        deleteImageFromFirebaseStorage(originalData.image);
      }

      updateDocToFirestore(data, COLLECTION_NAME.PRODUCT_TYPES);

      return data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  deleteDoc(id: string): void {
    if (!id) {
      console.log('Null id');
      return;
    }

    deleteDocFromFirestore(COLLECTION_NAME.PRODUCT_TYPES, id);
  }
}
