import { DocumentData, collection, doc, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { deleteObject, ref } from 'firebase/storage';
import { db, storage } from '@/firebase/config';

import RowModalLayout from './RowModalLayout';
import { useSnackbarService } from '@/lib/contexts';
import { ProductObject } from '@/lib/models';
import { ManageContextType, ManageActionType } from '@/lib/localLib/manage';
import { checkIfDataChanged } from '@/lib/localLib/manage-modal';
import { ManageContext } from '@/pages/manager/manage';
import ProductForm from '../forms/ProductForm';
import {
  getDownloadUrlFromFirebaseStorage,
  uploadImageToFirebaseStorage,
  addDocumentToFirestore,
  deleteImageFromFirebaseStorage,
  updateDocumentToFirestore,
} from '@/lib/firestore/firestoreLib';

interface FirebaseImage {
  path: string;
  url: string | null;
}

interface UploadedImage {
  file: File;
  url: string | null;
}

export default function ProductRowModal() {
  //#region States

  const [originalDisplayingData, setOriginalDisplayingData] =
    useState<DocumentData | null>(null);

  // Gallery
  // Contains files uploaded
  const [galleryImages, setGalleryImages] = useState<UploadedImage[] | null>(
    null,
  );

  // Contains urls from firebase storage
  const [firebaseStorageImages, setFirebaseStorageImages] = useState<
    FirebaseImage[] | null
  >(null);

  const [originalFirebaseStorageImages, setOriginalFirebaseStorageImages] =
    useState<FirebaseImage[] | null>(null);

  //#endregion

  //#region Hooks

  const {
    state,
    dispatch,
    handleDeleteRowOnFirestore: handleDeleteRow,
    handleViewRow,
    resetDisplayingData,
  } = useContext<ManageContextType>(ManageContext);

  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  //#region useEffects

  useEffect(() => {
    // Check if displaying data exist.
    // If no then alert and close the modal
    if (!state.displayingData) {
      alert('No data passed to the modal');
      dispatch({
        type: ManageActionType.SET_CRUD_MODAL_OPEN,
        payload: false,
      });
      return;
    }

    setOriginalDisplayingData(state.displayingData);

    let _firebaseStorageImages: FirebaseImage[] =
      state.displayingData.images.map(
        (image: string) =>
          ({
            path: image,
            url: null,
          } as FirebaseImage),
      );

    async function GetDownloadURLs() {
      console.log(_firebaseStorageImages);

      _firebaseStorageImages = await Promise.all(
        _firebaseStorageImages.map(async (image) => {
          return {
            ...image,
            url: await getDownloadUrlFromFirebaseStorage(image.path),
          };
        }),
      );

      console.log(_firebaseStorageImages);

      setFirebaseStorageImages(_firebaseStorageImages);
      setOriginalFirebaseStorageImages(_firebaseStorageImages);
    }

    GetDownloadURLs();
  }, []);

  //#endregion

  //#region Hanlders

  const handleUploadGalleryToBrowser = (event: any) => {
    const file = event.target.files[0];

    console.log('Running...');

    if (!file) return;

    const newImage: UploadedImage = {
      file,
      url: URL.createObjectURL(file),
    };

    if (!galleryImages || galleryImages.length === 0) {
      setGalleryImages([newImage]);
      return;
    }

    setGalleryImages([...galleryImages, newImage]);
  };

  /**
   * Adds a new document to Firestore collection.
   *
   * @param {Object} data - The data to be added to Firestore.
   * @return {string} The ID of the newly created document.
   * @throws {Error} If there is an error adding the new document to Firestore.
   */

  const handleAddNewRow = async () => {
    if (state.crudModalMode !== 'create') {
      handleSnackbarAlert('error', 'Wrong mode detected');
      dispatch({
        type: ManageActionType.SET_CRUD_MODAL_OPEN,
        payload: false,
      });
      return;
    }

    // Check if displaying data is null
    if (!state.displayingData) {
      const errorMsg = 'Null data error';
      handleSnackbarAlert('error', `Lỗi: ${errorMsg}`);
      return;
    }

    // validate data before adding
    const { isValid, errorMessage } = validateData(
      state.displayingData as ProductObject,
    );

    if (!isValid) {
      handleSnackbarAlert('error', errorMessage);
      return;
    }

    const collectionName = state.selectedTarget?.collectionName;

    if (!collectionName) return;

    // Image existence check
    if (!galleryImages || galleryImages.length === 0) {
      handleSnackbarAlert('error', 'Vui lòng chọn ảnh cho sản phẩm');
      return;
    }

    try {
      // Upload image
      const imageURLs = await Promise.all(
        galleryImages.map(
          async (image) => await uploadImageToFirebaseStorage(image.file),
        ),
      );

      console.log(imageURLs);

      // Image upload fail
      if (!imageURLs || imageURLs.length === 0) {
        handleSnackbarAlert('error', 'Tải lên ảnh lên thất bại');
        return;
      }

      const data = {
        ...state.displayingData,
        images: imageURLs,
      };

      // Add new document to Firestore
      const docId = await addDocumentToFirestore(data, collectionName);

      // Add new row to table data
      dispatch({
        type: ManageActionType.SET_MAIN_DOCS,
        payload: [...state.mainDocs, { id: docId, ...data }],
      });
    } catch (error) {
      console.log('Error adding new document: ', error);
      handleSnackbarAlert('error', 'Thêm mới thất bại');
    }

    handleSnackbarAlert('success', 'Thêm mới thành công');

    // Close modal
    dispatch({
      type: ManageActionType.SET_CRUD_MODAL_OPEN,
      payload: false,
    });
  };

  const handleUpdateRow = async () => {
    //#region Local functions

    function switchBackToViewMode() {
      dispatch({
        type: ManageActionType.SET_CRUD_MODAL_MODE,
        payload: 'view',
      });
    }

    function handleUpdateSuccess() {
      switchBackToViewMode();
      handleSnackbarAlert('success', 'Cập nhật thành công');
    }

    function handleUpdateFail() {
      switchBackToViewMode();
      handleSnackbarAlert('success', 'Cập nhật thất bại');
    }

    function handleNoUpdateMade() {
      switchBackToViewMode();
      handleSnackbarAlert('info', 'Đã không có cập nhật nào xảy ra!');
    }

    //#endregion

    if (state.crudModalMode !== 'update') {
      alert('Wrong mode detected');
      handleUpdateFail();
      return;
    }

    // Check if displaying data is null
    if (!state.displayingData) {
      const errorMsg = 'Null data error';
      handleSnackbarAlert('error', `Lỗi: ${errorMsg}`);
      return;
    }

    // Validation
    const { isValid, errorMessage } = validateData(
      state.displayingData as ProductObject,
    );

    if (!isValid) {
      handleSnackbarAlert('error', errorMessage);
      return;
    }

    // Check if image changed
    const imageChanged = checkIfGalleryChanged();

    // Check if data changed
    const dataChanged = checkIfDataChanged(
      originalDisplayingData,
      state.displayingData,
    );

    if (!imageChanged && !dataChanged) {
      handleNoUpdateMade();
    }

    try {
      // Proceed to update things
      if (imageChanged) updateGalleryToFirebaseStorage();

      if (!dataChanged) {
        handleUpdateSuccess();
      }

      const collectionName = state.selectedTarget?.collectionName;
      const displayingData = state.displayingData;

      if (!collectionName || !displayingData) {
        handleUpdateFail();
        return;
      }

      // Update document to firestore
      updateDocumentToFirestore(displayingData, collectionName);

      // Update state
      dispatch({
        type: ManageActionType.UPDATE_SPECIFIC_DOC,
        payload: { id: displayingData.id, data: displayingData },
      });

      // Close modal
      handleUpdateSuccess();
    } catch (error) {
      console.log('Update row failed, error: ', error);
      handleSnackbarAlert('error', `Cập nhật thất bại, error: ${error}`);
    }
  };

  const handleDeleteImage = (url: string) => {
    if (firebaseStorageImages?.map((image) => image.url).includes(url)) {
      setFirebaseStorageImages(
        firebaseStorageImages.filter((image) => image.url !== url),
      );
      return;
    }

    if (galleryImages?.map((image) => image.url).includes(url)) {
      setGalleryImages(galleryImages.filter((image) => image.url !== url));
      return;
    }
  };

  //#endregion

  //#region Functions

  //#endregion

  //#region Methods

  function checkIfGalleryChanged(): boolean {
    const imageUploaded: boolean =
      Boolean(galleryImages) && galleryImages!.length > 0;

    const galleryChanged =
      originalFirebaseStorageImages !== firebaseStorageImages || imageUploaded;

    console.log(galleryChanged);

    return galleryChanged;
  }

  async function updateGalleryToFirebaseStorage() {
    if (!checkIfGalleryChanged()) return;

    if (!state.displayingData) {
      const msg = 'Không có dữ liệu';

      handleSnackbarAlert('error', `Lỗi: ${msg}`);
      return;
    }

    // Upload images
    const downloadURLs = await uploadGalleryToStorage();

    const newDownloadURLs = await updateFirestoreGalleryToStorage();

    // Update state
    dispatch({
      type: ManageActionType.SET_DISPLAYING_DATA,
      payload: { ...state.displayingData, images: downloadURLs },
    });

    // Update main docs
    dispatch({
      type: ManageActionType.UPDATE_SPECIFIC_DOC,
      payload: {
        id: state.displayingData.id,
        data: { ...state.displayingData, images: downloadURLs },
      },
    });
  }

  const resetForm = () => {
    resetDisplayingData();
    setGalleryImages(null);
    setFirebaseStorageImages(null);
  };

  function validateData(data: ProductObject): {
    isValid: boolean;
    errorMessage: string;
  } {
    if (!data.name || data.name.length === 0) {
      return {
        isValid: false,
        errorMessage: 'Chưa có tên sản phẩm',
      };
    }

    if (!data.productType_id || data.name.length === 0) {
      return {
        isValid: false,
        errorMessage: 'Chưa chọn loại sản phẩm',
      };
    }

    if (!data.ingredients || data.ingredients.length === 0) {
      return {
        isValid: false,
        errorMessage: 'Sản phẩm phải có ít nhất một nguyên liệu',
      };
    }

    if (!data.materials || data.materials.length === 0) {
      return {
        isValid: false,
        errorMessage: 'Sản phẩm phải có ít nhất một vật liệu',
      };
    }

    if (!data.colors || data.colors.length === 0) {
      return {
        isValid: false,
        errorMessage: 'Sản phẩm phải có ít nhất một màu sắc',
      };
    }
    if (!data.sizes || data.sizes.length === 0) {
      return {
        isValid: false,
        errorMessage: 'Sản phẩm phải có ít nhất một kích cỡ',
      };
    }

    return {
      isValid: true,
      errorMessage: 'ok',
    };
  }

  function generateURLs(): (string | null)[] {
    let urls: (string | null)[] = [];

    if (firebaseStorageImages)
      urls = [...urls, ...firebaseStorageImages.map((image) => image.url)];

    if (galleryImages)
      urls = [...urls, ...galleryImages.map((image) => image.url)];

    console.log(urls);

    return urls;
  }

  async function uploadGalleryToStorage(): Promise<string[] | null> {
    if (galleryImages && galleryImages.length > 0) {
      try {
        const imageURLs = await Promise.all(
          galleryImages.map(
            async (image) => await uploadImageToFirebaseStorage(image.file),
          ),
        );

        return imageURLs;
      } catch (error) {
        handleSnackbarAlert('error', 'Lỗi up ảnh');
        return null;
      }
    }

    return null;
  }

  async function updateFirestoreGalleryToStorage() {
    // Remove deleted images
    const deletedImages = await deleteOldImagesFromStorage();

    // Upload new images
    let uploadedImageURLs: string[] | null = [];

    if (galleryImages && galleryImages.length > 0) {
      uploadedImageURLs = await uploadGalleryToStorage();

      if (!uploadedImageURLs) {
        handleSnackbarAlert('error', 'Lỗi up ảnh mới');
        return;
      }
    }

    // Generate new images
    const firebaseStorageImagesAfterDeleteOldImages: string[] = [];

    if (firebaseStorageImages && firebaseStorageImages.length > 0) {
      for (const image of firebaseStorageImages) {
        if (image.url && !deletedImages.includes(image)) {
          firebaseStorageImagesAfterDeleteOldImages.push(image.url);
        }
      }
    }

    updateDisplayingDocumentImages([
      ...firebaseStorageImagesAfterDeleteOldImages,
      ...uploadedImageURLs,
    ]);
  }

  async function updateDisplayingDocumentImages(imageURLs: string[]) {
    if (!state.displayingData) return;

    // Get doc ref data
    const collectionName = state.selectedTarget?.collectionName;

    if (!collectionName) {
      handleSnackbarAlert(
        'error',
        'Lỗi state.selectedTarget.collectionName null',
      );
      return;
    }

    // Update to firestore
    const docRef = doc(db, collectionName, state.displayingData.id);

    await updateDoc(docRef, {
      images: imageURLs,
    });

    // Update main docs
    dispatch({
      type: ManageActionType.UPDATE_SPECIFIC_DOC,
      payload: {
        id: state.displayingData.id,
        data: { ...state.displayingData, images: imageURLs },
      },
    });
  }

  async function deleteOldImagesFromStorage(): Promise<FirebaseImage[]> {
    if (
      !originalFirebaseStorageImages ||
      originalFirebaseStorageImages.length === 0
    )
      return [];

    if (!firebaseStorageImages || firebaseStorageImages.length === 0) return [];

    const deletedImages: FirebaseImage[] = [];

    for (const image of firebaseStorageImages) {
      if (originalFirebaseStorageImages.includes(image)) continue;

      try {
        await deleteImageFromFirebaseStorage(image.path);

        deletedImages.push(image);
      } catch (error) {
        handleSnackbarAlert('error', `Lỗi xóa ảnh cũ: ${error}`);
      }
    }

    return deletedImages;
  }

  //#endregion

  return (
    <RowModalLayout
      handleAddNewRow={handleAddNewRow}
      handleUpdateRow={handleUpdateRow}
      resetForm={resetForm}
    >
      <ProductForm
        imageURLs={generateURLs()}
        handleUploadGalleryToBrowser={handleUploadGalleryToBrowser}
        readOnly={state.crudModalMode === 'view'}
        handleDeleteImage={handleDeleteImage}
      />
    </RowModalLayout>
  );
}
