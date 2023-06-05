import { db, storage } from '@/firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import React, { memo, useContext, useEffect, useState } from 'react';

import { ManageContext, useSnackbarService } from '@/lib/contexts';
import {
  addDocToFirestore,
  getDownloadUrlsFromFirebaseStorage,
  updateDocToFirestore,
  uploadImageToFirebaseStorage,
} from '@/lib/firestore/firestoreLib';
import { ManageActionType, ManageContextType } from '@/lib/localLib/manage';
import { checkIfDataChanged } from '@/lib/localLib/manage-modal';
import { ProductTypeObject } from '@/lib/models';
import BaseObject from '@/lib/models/BaseObject';
import ProductTypeForm from '../forms/ProductTypeForm';
import RowModalLayout from './RowModalLayout';

const ProductTypeRowModal = () => {
  //#region States

  const { state, dispatch, resetDisplayingData } =
    useContext<ManageContextType>(ManageContext);

  /**
   * This is used to stored URL of the featured on storage
   * If this changed to local URL, that's mean we need to update the image
   */
  const [originalDisplayingData, setOriginalDisplayingData] =
    useState<BaseObject | null>(null);
  const [originalFeaturedImageURL, setOriginalFeaturedImageURL] = useState<
    string | null
  >(null);

  // Image manage
  const [featuredImageURL, setFeaturedImageURL] = useState<string | null>(null);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);

  //#endregion

  //#region Hooks

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

    setOriginalDisplayingData(() => state.displayingData);

    const displayingProductType: ProductTypeObject =
      state.displayingData as ProductTypeObject;

    let downloadURL: string | null = null;

    async function ExecuteGetDownloadURLAndLoadImageToView() {
      downloadURL = await GetDownloadURLAndLoadImageToView(
        displayingProductType!.image
      );

      if (downloadURL) setOriginalFeaturedImageURL(() => downloadURL);
    }

    ExecuteGetDownloadURLAndLoadImageToView();
  }, []);

  useEffect(() => {
    if (featuredImageFile) {
      setFeaturedImageURL(() => URL.createObjectURL(featuredImageFile));
    }
  }, [featuredImageFile]);

  //#endregion

  //#region Functions

  function loadImageToView(image: string) {
    if (!image || image.length === 0) return;

    setFeaturedImageURL(() => image);
  }

  async function GetDownloadURLAndLoadImageToView(
    image: string
  ): Promise<string | null> {
    // Null check
    if (!image || image.length === 0) return null;

    const downloadURLs = await getDownloadUrlsFromFirebaseStorage([image]);

    if (downloadURLs && downloadURLs.length > 0) {
      loadImageToView(downloadURLs[0]);

      return downloadURLs[0];
    }

    return null;
  }

  //#endregion

  //#region Methods

  function checkIfImageChanged(): boolean {
    return originalFeaturedImageURL !== featuredImageURL;
  }

  async function updateImageToFirebaseStorage() {
    if (!state.displayingData) throw new Error('Null displaying data');

    if (!checkIfImageChanged()) return;

    const displayingProductType: ProductTypeObject =
      state.displayingData as ProductTypeObject;

    // Remove old image from storage
    if (displayingProductType.image) {
      try {
        const imageRef = ref(storage, displayingProductType.image);
        await deleteObject(imageRef);
      } catch (error) {
        console.log('Error: ', error);
      }
    } else {
      console.log('No image found');
      return;
    }

    // Upload new image to storage
    if (featuredImageFile) {
      try {
        const downloadURL = await uploadImageToFirebaseStorage(
          featuredImageFile
        );

        // Update document image
        const docRef = doc(
          db,
          state.selectedTarget?.collectionName!,
          displayingProductType.id
        );

        await updateDoc(docRef, {
          image: downloadURL,
        });

        // Update state
        dispatch({
          type: ManageActionType.SET_DISPLAYING_DATA,
          payload: { ...state.displayingData, image: downloadURL },
        });

        // Update main docs
        dispatch({
          type: ManageActionType.UPDATE_SPECIFIC_DOC,
          payload: {
            id: state.displayingData.id,
            data: { ...state.displayingData, image: downloadURL },
          },
        });
      } catch (error) {
        console.log('Error: ', error);
      }
    } else {
      handleSnackbarAlert('error', 'Không có hình ảnh nào');
    }
  }

  const resetForm = () => {
    resetDisplayingData();
    setFeaturedImageFile(() => null);
    setFeaturedImageURL(() => null);
  };

  //#endregion

  //#region Hanlders

  const handleUploadImageToBrowser = (event: any) => {
    const file = event.target.files[0];

    if (file) setFeaturedImageFile(() => file);
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
      alert('Wrong mode detected');
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

    const displayingProductType: ProductTypeObject =
      state.displayingData as ProductTypeObject;

    // Check product type name if it is empty or not
    if (!displayingProductType.name || displayingProductType.name === '') {
      handleSnackbarAlert('error', 'Vui lòng nhập tên loại sản phẩm');
      return;
    }

    const collectionName = state.selectedTarget?.collectionName;

    if (!collectionName) return;

    // Image existence check
    if (!featuredImageFile) {
      handleSnackbarAlert('error', 'Vui lòng chọn ảnh cho sản phẩm');
      return;
    }

    try {
      // Upload image
      const imageURL = await uploadImageToFirebaseStorage(featuredImageFile);

      // Image upload fail
      if (!imageURL) {
        handleSnackbarAlert('error', 'Tải lên ảnh lên thất bại');
        return;
      }

      const data = {
        ...state.displayingData,
        image: imageURL,
      };

      // Add new document to Firestore
      const docRef = await addDocToFirestore(data, collectionName);

      if (!state.mainDocs) throw new Error('Null main docs');

      // Add new row to table data
      dispatch({
        type: ManageActionType.SET_MAIN_DOCS,
        payload: [...state.mainDocs, { ...data, id: docRef.id }],
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

    const productTypeObject: ProductTypeObject =
      state.displayingData as ProductTypeObject;

    // Check product type name if it is empty or not
    if (!productTypeObject.name || productTypeObject.name === '') {
      handleSnackbarAlert('error', 'Vui lòng nhập tên loại sản phẩm');
      return;
    }

    // Check if image changed
    const imageChanged = checkIfImageChanged();

    // Check if data changed
    const dataChanged = checkIfDataChanged(
      originalDisplayingData,
      state.displayingData
    );

    if (!imageChanged && !dataChanged) {
      handleNoUpdateMade();
    }

    try {
      // Proceed to update things
      if (imageChanged) updateImageToFirebaseStorage();

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
      updateDocToFirestore(displayingData, collectionName);

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

  //#endregion

  return (
    <RowModalLayout
      handleAddNewRow={handleAddNewRow}
      handleUpdateRow={handleUpdateRow}
      resetForm={resetForm}
    >
      <ProductTypeForm
        featuredImageURL={featuredImageURL}
        handleUploadImageToBrowser={handleUploadImageToBrowser}
        readOnly={state.crudModalMode === 'view'}
      />
    </RowModalLayout>
  );
};

export default memo(ProductTypeRowModal);
