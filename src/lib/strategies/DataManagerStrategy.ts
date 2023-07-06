import { COLLECTION_NAME } from '@/lib/constants';
import { Timestamp } from 'firebase/firestore';
import { Dispatch } from 'react';
import {
  PathWithUrl,
  StorageProductObject,
  StorageProductTypeObject,
  addDocToFirestore,
  deleteDocFromFirestore,
  deleteImageFromFirebaseStorage,
  deleteImagesFromFirebaseStorage,
  getDocFromDocRef,
  getDownloadUrlFromFirebaseStorage,
  updateDocToFirestore,
  uploadImageToFirebaseStorage,
} from '../firestore/firestoreLib';
import {
  FileWithUrl,
  ManageAction,
  ModalProductObject,
  ModalProductTypeObject,
} from '../localLib/manage';
import BaseObject from '../models/BaseObject';
import { createBatchObjecet as createBatchObject } from '../models/Batch';
import { ProductObject, createProductObject } from '../models/Product';
import {
  ProductTypeObject,
  createProductTypeObject,
} from '../models/ProductType';
import { uploadImagesToFirebaseStorage } from './../firestore/firestoreLib';

export enum DataManagerErrorCode {
  NULL_FIELD = 'null-field',
  NULL_ADD_DATA = 'null-data-data',
  NULL_DATA = 'null-data',
}

//#region Add

export type AddData = {
  data: BaseObject;
};

export type ProductTypeAddData = AddData & {
  imageFile?: File;
};

export type ProductAddData = AddData & {
  productTypeName: string;
  imageFiles: File[];
};

export type BatchAddData = AddData & {};

//#endregion

//#region Update

export type UpdateData = {
  newData: BaseObject;
  originalData: BaseObject;
};

export type ProductTypeUpdateData = UpdateData & {
  imageFile: File;
};

export type ProductUpdateData = UpdateData & {
  imageFiles: FileWithUrl[];
};

export type BatchUpdateData = UpdateData & {};

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

    console.log(refinedData);

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

export class ProductDataManagerStrategy implements DataManagerStrategy {
  dispatch: React.Dispatch<ManageAction>;

  constructor(dispatch: React.Dispatch<ManageAction>) {
    this.dispatch = dispatch;
  }

  async addDoc(addData: AddData): Promise<BaseObject> {
    if (!addData) throw new Error(DataManagerErrorCode.NULL_ADD_DATA);

    const productAddData = addData as ProductAddData;

    if (!productAddData.data) throw new Error(DataManagerErrorCode.NULL_DATA);

    const data = createProductObject(productAddData.data);

    let images: string[] = [];

    if (productAddData.imageFiles)
      images = await uploadImagesToFirebaseStorage(productAddData.imageFiles);

    data.images = images;

    const newProductRef = await addDocToFirestore(
      data,
      COLLECTION_NAME.PRODUCTS
    );

    const refetchData = await getDocFromDocRef<ProductObject>(newProductRef);

    let imageUrls: PathWithUrl[] = [];

    if (refetchData.images)
      imageUrls = await Promise.all(
        images.map(async (image) => {
          let url = '';

          try {
            url = await getDownloadUrlFromFirebaseStorage(image);
          } catch (error: any) {
            console.log(error);
          }

          return {
            url,
            path: image,
          } as PathWithUrl;
        })
      );

    const refinedData: ModalProductObject = {
      ...refetchData,
      productTypeName: productAddData.productTypeName,
      imageUrls: imageUrls,
    };

    return refinedData;
  }

  async updateDoc(updateData: UpdateData): Promise<BaseObject> {
    const productUpdateData = { ...updateData } as ProductUpdateData;

    console.log(updateData);

    const data = createProductObject(updateData.newData);
    // const originalData = createProductObject(updateData.originalData);

    console.log(data);

    try {
      if (
        (productUpdateData.newData as ModalProductObject).imageUrls !==
        (productUpdateData.originalData as ModalProductObject).imageUrls
      ) {
        const updatedPaths: string[] =
          await deleteOldImagesAndAddNewImagesToFirebaseStorage(
            (productUpdateData.originalData as ModalProductObject).imageUrls,
            (productUpdateData.newData as ModalProductObject).imageUrls,
            productUpdateData.imageFiles
          );

        console.log(updatedPaths);

        data.images = updatedPaths;
      }

      updateDocToFirestore(data, COLLECTION_NAME.PRODUCTS);

      return data;
    } catch (error: any) {
      throw new Error(error);
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

    const castedDoc = doc as StorageProductObject;

    if (castedDoc.images) deleteImagesFromFirebaseStorage(castedDoc.images);

    deleteDocFromFirestore(COLLECTION_NAME.PRODUCTS, doc.id);
  }
}

export class BatchDataManagerStrategy implements DataManagerStrategy {
  dispatch: Dispatch<ManageAction>;

  constructor(dispatch: Dispatch<ManageAction>) {
    this.dispatch = dispatch;
  }

  async addDoc(addData: AddData): Promise<BaseObject> {
    if (!addData) throw new Error(DataManagerErrorCode.NULL_ADD_DATA);

    const batchAddData = addData as BatchAddData;

    const data = createBatchObject(batchAddData.data);

    if (!batchAddData.data) throw new Error(DataManagerErrorCode.NULL_DATA);

    const newDocRef = await addDocToFirestore(
      {
        ...data,
        MFG: Timestamp.fromDate(data.MFG),
        EXP: Timestamp.fromDate(data.EXP),
        discount: {
          ...data.discount,
          date: Timestamp.fromDate(data.discount.date),
        },
      } as BaseObject,
      COLLECTION_NAME.BATCHES
    );

    return { ...batchAddData.data, id: newDocRef.id };
  }
  async updateDoc(updateData: UpdateData): Promise<BaseObject> {
    const batchUpdateData = { ...updateData } as BatchUpdateData;

    const data = createBatchObject(batchUpdateData.newData);

    console.log(data);

    try {
      updateDocToFirestore(data, COLLECTION_NAME.BATCHES);

      return batchUpdateData.newData;
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

    deleteDocFromFirestore(COLLECTION_NAME.BATCHES, doc.id);
  }
}

//#region Local Functions

function deleteOldImages(
  originalImageUrls: PathWithUrl[],
  newImageUrls: PathWithUrl[]
): string[] {
  let deletedPaths: string[] = [];

  for (const url of originalImageUrls) {
    if (!newImageUrls.includes(url)) {
      if (!url.path) continue;

      try {
        deleteImageFromFirebaseStorage(url.path);
        deletedPaths.push(url.path);
      } catch (error: any) {
        console.log(error);
      }
    }
  }

  return deletedPaths;
}

async function uploadNewImages(
  newImageUrls: PathWithUrl[],
  imageFiles: FileWithUrl[]
): Promise<string[]> {
  console.log(newImageUrls);

  const paths = newImageUrls
    .filter((url) => url.path)
    .map((url) => url.path ?? '');

  const uploadPaths = await Promise.all(
    imageFiles.map(
      async (file) => await uploadImageToFirebaseStorage(file.file)
    )
  );

  return [...paths, ...uploadPaths];
}

async function deleteOldImagesAndAddNewImagesToFirebaseStorage(
  originalImageUrls: PathWithUrl[],
  newImageUrls: PathWithUrl[],
  imageFiles: FileWithUrl[]
): Promise<string[]> {
  const deletedPaths: string[] = deleteOldImages(
    originalImageUrls,
    newImageUrls
  );

  const updatedPaths: string[] = await uploadNewImages(
    newImageUrls,
    imageFiles
  );

  return updatedPaths;
}

//#endregion
