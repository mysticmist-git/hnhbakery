import { COLLECTION_NAME } from '@/lib/constants';
import {
  BaseModel,
  ModalProduct,
  ModalProductType,
  StorageBatch,
  StorageProduct,
  StorageProductType,
} from '@/models/storageModels';
import { doc } from 'firebase/firestore';
import { Dispatch } from 'react';
import { createBatch, deleteBatch, updateBatch } from '../DAO/batchDAO';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProductsRef,
  updateProduct,
} from '../DAO/productDAO';
import {
  createProductType,
  deleteProductType,
  getProductTypeById,
  getProductTypesRef,
  updateProductType,
} from '../DAO/productTypeDAO';
import { getVariant } from '../DAO/variantDAO';
import {
  addDocToFirestore,
  deleteImageFromFirebaseStorage,
  deleteImagesFromFirebaseStorage,
  getDownloadUrlFromFirebaseStorage,
  updateDocToFirestore,
  uploadImageToFirebaseStorage,
  uploadImagesToFirebaseStorage,
} from '../firestore';
import { PathWithUrl } from '../models';
import { FileWithUrl, ManageAction } from '../types/manage';
import {
  createBatchObject,
  createProductObject,
  createProductTypeObject,
} from '../utils';

export enum DataManagerErrorCode {
  NULL_FIELD = 'null-field',
  NULL_ADD_DATA = 'null-data-data',
  NULL_DATA = 'null-data',
  NO_DOC_FOUND = 'no-doc-found',
}

//#region Add

export type AddData = {
  data: BaseModel;
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
  newData: BaseModel;
  originalData: BaseModel;
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
  addDoc(addData: AddData): Promise<BaseModel>;
  updateDoc(updateData: UpdateData): Promise<BaseModel>;
  deleteDoc(doc: BaseModel): void;
}

export class ProductTypeDataManagerStrategy implements DataManagerStrategy {
  dispatch: React.Dispatch<ManageAction>;

  constructor(dispatch: React.Dispatch<ManageAction>) {
    this.dispatch = dispatch;
  }

  async addDoc(addData: AddData): Promise<BaseModel> {
    if (!addData) throw new Error(DataManagerErrorCode.NULL_ADD_DATA);

    const productTypeAddData = addData as ProductTypeAddData;

    if (!productTypeAddData.data)
      throw new Error(DataManagerErrorCode.NULL_DATA);

    const data = createProductTypeObject(productTypeAddData.data);

    let image: string = '';

    const productTypeRef = doc(getProductTypesRef());

    if (productTypeAddData.imageFile)
      image = await uploadImageToFirebaseStorage(
        `typeFeaturedImages/${productTypeRef.id}`,
        productTypeAddData.imageFile
      );

    data.image = image;

    await createProductType(productTypeRef, data);

    // const refetchData = await getDocFromFirestore<ProductTypeObject>(
    //   COLLECTION_NAME.PRODUCT_TYPES,
    //   ref.id
    // );

    const refetchData = await getProductTypeById(productTypeRef.id);

    if (refetchData) {
      let imageURL = '';

      if (refetchData.image)
        imageURL = await getDownloadUrlFromFirebaseStorage(refetchData.image);

      const refinedData: ModalProductType = {
        ...refetchData,
        productCount: 0,
        imageURL: imageURL,
      };

      return refinedData;
    } else {
      throw new Error(DataManagerErrorCode.NO_DOC_FOUND);
    }
  }

  async updateDoc(updateData: UpdateData): Promise<BaseModel> {
    const productTypeUpdateData = { ...updateData } as ProductTypeUpdateData;

    const data = createProductTypeObject(productTypeUpdateData.newData);
    const originalData = createProductTypeObject(
      productTypeUpdateData.originalData
    );

    if (
      (productTypeUpdateData.newData as ModalProductType).imageURL !==
      (productTypeUpdateData.originalData as ModalProductType).imageURL
    ) {
      let newImagePath = '';

      try {
        newImagePath = await uploadImageToFirebaseStorage(
          `typeFeaturedImages/${productTypeUpdateData.newData.id}`,
          productTypeUpdateData.imageFile
        );
      } catch (error) {
        console.log(error);
      }

      data.image = newImagePath;

      // if (originalData.image)
      //   try {
      //     deleteImageFromFirebaseStorage(originalData.image);
      //   } catch (error) {
      //     console.log(error);
      //   }
    }

    try {
      updateProductType(productTypeUpdateData.newData.id, data);
    } catch (error) {
      console.log(error);
    }

    return data;
  }

  deleteDoc(doc: BaseModel): void {
    if (!doc) {
      console.log('Null doc');
      throw new Error('Null doc');
    }

    if (!doc.id) {
      console.log('Null id');
      throw new Error('Null id');
    }

    const castedDoc = doc as StorageProductType;

    if (castedDoc.image) deleteImageFromFirebaseStorage(castedDoc.image);

    deleteProductType(doc.id);
  }
}

export class ProductDataManagerStrategy implements DataManagerStrategy {
  dispatch: React.Dispatch<ManageAction>;

  constructor(dispatch: React.Dispatch<ManageAction>) {
    this.dispatch = dispatch;
  }

  async addDoc(addData: AddData): Promise<BaseModel> {
    if (!addData) throw new Error(DataManagerErrorCode.NULL_ADD_DATA);

    const productAddData = addData as ProductAddData;

    if (!productAddData.data) throw new Error(DataManagerErrorCode.NULL_DATA);

    const data = createProductObject(productAddData.data);

    const ref = doc(getProductsRef(data.product_type_id));

    let images: string[] = [];

    if (productAddData.imageFiles)
      images = await uploadImagesToFirebaseStorage(
        `productGalleries/${ref.id}`,
        productAddData.imageFiles
      );

    data.images = images;

    await createProduct(ref, data);

    const refetchedData = await getProduct(data.product_type_id, ref.id);

    let imageUrls: PathWithUrl[] = [];

    if (!refetchedData) throw new Error(DataManagerErrorCode.NO_DOC_FOUND);

    if (refetchedData.images)
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

    const refinedData: ModalProduct = {
      ...refetchedData,
      imageUrls: imageUrls,
    };

    return refinedData;
  }

  async updateDoc(updateData: UpdateData): Promise<BaseModel> {
    const productUpdateData = { ...updateData } as ProductUpdateData;

    const data = createProductObject(updateData.newData);
    // const originalData = createProductObject(updateData.originalData);

    try {
      if (
        (productUpdateData.newData as ModalProduct).imageUrls !==
        (productUpdateData.originalData as ModalProduct).imageUrls
      ) {
        let updatedPaths: string[] = [];

        updatedPaths = await deleteOldImagesAndAddNewImagesToFirebaseStorage(
          productUpdateData.newData.id ?? '',
          (productUpdateData.originalData as ModalProduct).imageUrls,
          (productUpdateData.newData as ModalProduct).imageUrls,
          productUpdateData.imageFiles
        );

        data.images = updatedPaths;
      }

      updateDocToFirestore(data, COLLECTION_NAME.PRODUCTS);
      updateProduct(data.product_type_id, data.id, data);

      return data;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  deleteDoc(doc: BaseModel): void {
    if (!doc) {
      console.log('Null doc');
      throw new Error('Null doc');
    }

    if (!doc.id) {
      console.log('Null id');
      throw new Error('Null id');
    }

    const castedDoc = doc as StorageProduct;

    if (castedDoc.images) deleteImagesFromFirebaseStorage(castedDoc.images);

    deleteProduct(castedDoc.product_type_id, castedDoc.id);
  }
}

export class BatchDataManagerStrategy implements DataManagerStrategy {
  dispatch: Dispatch<ManageAction>;

  constructor(dispatch: Dispatch<ManageAction>) {
    this.dispatch = dispatch;
  }

  async addDoc(addData: AddData): Promise<BaseModel> {
    if (!addData) throw new Error(DataManagerErrorCode.NULL_ADD_DATA);

    const batchAddData = addData as BatchAddData;

    const data = createBatchObject(batchAddData.data);

    if (!batchAddData.data) throw new Error(DataManagerErrorCode.NULL_DATA);

    const newDocRef = await addDocToFirestore(
      {
        ...data,
        mfg: data.mfg,
        exp: data.exp,
        discount: data.discount,
      } as BaseModel,
      COLLECTION_NAME.BATCHES
    );

    await createBatch(
      data.product_type_id,
      data.product_id,
      data.variant_id,
      data
    );

    const productType = await getProductTypeById(data.product_type_id);
    const product = await getProduct(data.product_type_id, data.product_id);
    const variant = await getVariant(
      data.product_type_id,
      data.product_id,
      data.variant_id
    );

    return {
      ...batchAddData.data,
      id: newDocRef.id,
      material: variant?.material,
      size: variant?.size,
      price: variant?.price,
    } as StorageBatch;
  }
  async updateDoc(updateData: UpdateData): Promise<BaseModel> {
    const batchUpdateData = { ...updateData } as BatchUpdateData;

    const data = createBatchObject(batchUpdateData.newData);

    console.log(data);

    try {
      updateBatch(
        data.product_type_id,
        data.product_id,
        data.variant_id,
        data.id,
        data
      );

      return batchUpdateData.newData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  deleteDoc(doc: BaseModel): void {
    if (!doc) {
      console.log('Null doc');
      throw new Error('Null doc');
    }

    if (!doc.id) {
      console.log('Null id');
      throw new Error('Null id');
    }

    const castedDoc = doc as StorageBatch;

    deleteBatch(
      castedDoc.product_type_id,
      castedDoc.product_id,
      castedDoc.variant_id,
      castedDoc.id
    );
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
  path: string,
  newImageUrls: PathWithUrl[],
  imageFiles: FileWithUrl[]
): Promise<string[]> {
  console.log(newImageUrls);

  const paths = newImageUrls
    .filter((url) => url.path)
    .map((url) => url.path ?? '');

  const uploadPaths = await uploadImagesToFirebaseStorage(
    path,
    imageFiles.map((file) => file.file)
  );

  // const uploadPaths = await Promise.all(
  //   imageFiles.map(
  //     async (file) => await uploadImageToFirebaseStorage(path, file.file)
  //   )
  // );

  return [...paths, ...uploadPaths];
}

async function deleteOldImagesAndAddNewImagesToFirebaseStorage(
  id: string,
  originalImageUrls: PathWithUrl[],
  newImageUrls: PathWithUrl[],
  imageFiles: FileWithUrl[]
): Promise<string[]> {
  if (!id) throw new Error('Null id');

  const deletedPaths: string[] = deleteOldImages(
    originalImageUrls,
    newImageUrls
  );

  const updatedPaths: string[] = await uploadNewImages(
    `productGalleries/${id}`,
    newImageUrls,
    imageFiles
  );

  return updatedPaths;
}

//#endregion
