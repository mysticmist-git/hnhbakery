import { DocumentData, doc, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { deleteObject, ref } from 'firebase/storage';
import { db, storage } from '@/firebase/config';

import { ManageContextType, ManageActionType } from '../../lib/manage';
import { ManageContext } from '../../manage';
import ProductForm from './forms/ProductForm';
import RowModalLayout from './RowModalLayout';
import {
  getDownloadUrlsFromFirebaseStorage,
  uploadImageToFirebaseStorage,
  addDocumentToFirestore,
  updateDocument,
} from '../../lib/firebaseLib';
import { checkIfDataChanged, isDataChanged } from './lib';

export default function ProductRowModal() {
  //#region States

  const [originalGalleryURLs, setOriginalGalleryURLs] = useState<
    string[] | null
  >(null);
  const [originalDisplayingData, setOriginalDisplayingData] =
    useState<DocumentData | null>(null);

  // Gallery
  const [galleryFiles, setGalleryFiles] = useState<File[] | null>(null);
  const [galleryURLs, setGalleryURLs] = useState<string[] | null>(null);

  //#endregion

  //#region Hooks

  const {
    state,
    dispatch,
    handleDeleteRow,
    handleViewRow,
    resetDisplayingData,
  } = useContext<ManageContextType>(ManageContext);

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

    let downloadURLs: string[] | null = null;

    async function ExecuteGetDownloadURLsAndLoadGalleryToView() {
      downloadURLs = await GetDownloadURLsAndLoadImagesToView(
        state.displayingData!.image,
      );
    }

    ExecuteGetDownloadURLsAndLoadGalleryToView();

    if (downloadURLs) setOriginalGalleryURLs(downloadURLs);
  }, []);

  useEffect(() => {
    if (galleryFiles) {
      const temp: string[] = [];

      for (const file of galleryFiles) {
        temp.push(URL.createObjectURL(file));
      }

      setGalleryURLs(temp);
    }
  }, [galleryFiles]);

  // This useEffect load image
  useEffect(() => {
    if (
      !state.crudModalOpen ||
      state.crudModalMode !== 'update' ||
      !state.displayingData?.images
    )
      return;

    setOriginalDisplayingData(state.displayingData ?? {});

    const getImageUrls = async () => {
      if (state.displayingData?.images) {
        const galleryURLs: string[] = await getDownloadUrlsFromFirebaseStorage([
          state.displayingData.images,
        ]);

        if (galleryURLs && galleryURLs.length > 0) {
          setGalleryURLs(galleryURLs);
          setOriginalGalleryURLs(galleryURLs);
        }
      }
    };

    getImageUrls();
  }, [state.crudModalOpen]);

  //#endregion

  //#region Hanlders

  const handleUploadImageToBrowser = (event: any) => {
    const file = event.target.files[0];

    if (!galleryFiles) {
      setGalleryFiles([file]);
      return;
    }

    setGalleryFiles([...galleryFiles, file]);
  };

  /**
   * Adds a new document to Firestore collection.
   *
   * @param {Object} data - The data to be added to Firestore.
   * @return {string} The ID of the newly created document.
   * @throws {Error} If there is an error adding the new document to Firestore.
   */

  const handleAddNewRow = async () => {
    console.log('hello');
    const collectionName = state.selectedTarget?.collectionName;

    if (!collectionName) return;

    // Check if image upload needed
    let data = { ...state.displayingData };

    if (galleryFiles) {
      const imageResults = [];

      for (const file of galleryFiles) {
        // Upload image
        const uploadImageResult = await uploadImageToFirebaseStorage(file);

        console.log('Upload image path:', uploadImageResult);

        // Get new row data
        if (!uploadImageResult) return;

        imageResults.push(uploadImageResult);
      }

      data = {
        ...state.displayingData,
        images: imageResults,
      };
    }

    // Upload to Firestore
    const docId = await addDocumentToFirestore(data, collectionName);

    // Add new row to table data
    dispatch({
      type: ManageActionType.SET_MAIN_DOCS,
      payload: [...state.mainDocs, { ...data, id: docId }],
    });

    dispatch({
      type: ManageActionType.SET_CRUD_MODAL_OPEN,
      payload: false,
    });
  };

  const handleUpdateRow = async () => {
    if (state.crudModalMode !== 'create') {
      alert('Wrong mode detected');
      dispatch({
        type: ManageActionType.SET_CRUD_MODAL_OPEN,
        payload: false,
      });
      return;
    }

    try {
      // Check if image changed
      const imageChanged = checkIfImageChanged();

      // Check if data changed
      const dataChanged = checkIfDataChanged(
        originalDisplayingData,
        state.displayingData,
      );

      // Proceed to update things

      if (!imageChanged && !dataChanged) {
        alert('Vui lòng thay đổi thông tin');
        return;
      }

      if (imageChanged) updateImagesToFirebaseStorage();

      if (!dataChanged) return;

      const collectionName = state.displayingData?.collectionName;
      const displayingData = state.displayingData;

      if (!collectionName || !displayingData) {
        alert('Errror at handleUpdateRow RowModal!');
        return;
      }

      // Update document to firestore
      updateDocument(displayingData, collectionName);

      // Update state
      dispatch({
        type: ManageActionType.SET_MAIN_DOCS,
        payload: [
          ...state.mainDocs.filter((doc) => doc.id !== displayingData.id),
          displayingData,
        ],
      });

      // Close modal
      dispatch({
        type: ManageActionType.SET_CRUD_MODAL_OPEN,
        payload: false,
      });
    } catch (error) {
      console.log('Update row failed, error: ', error);
    }
  };
  //#endregion

  //#region Functions

  function loadGalleryToView(images: string[]) {
    if (!images || images.length === 0) return;

    setGalleryURLs(images);
  }

  async function GetDownloadURLsAndLoadImagesToView(
    images: string[],
  ): Promise<string[] | null> {
    // Null check
    if (!images || images.length === 0) return null;

    const downloadURLs: string[] = [];

    for (const image of images) {
      if (!image || !image) return null;

      const downloadURL = await getDownloadUrlsFromFirebaseStorage(image);

      downloadURLs.push(downloadURL);
    }

    loadGalleryToView(downloadURLs);
    return downloadURLs;
  }

  //#endregion

  //#region Methods

  function checkIfImageChanged(): boolean {
    if (!originalGalleryURLs || originalGalleryURLs.length === 0) {
      alert('No original image URL found');
      return false;
    }

    if (!galleryURLs || galleryURLs.length === 0) {
      alert('No image URL found');
      return false;
    }

    return originalGalleryURLs !== galleryURLs;
  }

  async function updateImagesToFirebaseStorage() {
    if (!checkIfImageChanged()) return;

    if (!galleryURLs || galleryURLs.length === 0) {
      alert('No image URL found');
      return false;
    }

    // Remove old images from storage
    if (
      state.displayingData?.images &&
      state.displayingData.images.length > 0
    ) {
      try {
        for (const image of state.displayingData.images) {
          if (!galleryURLs.includes(image)) {
            const oldImageRef = ref(storage, image);
            await deleteObject(oldImageRef);
          }
        }
      } catch (error) {
        console.log('Error: ', error);
      }
    } else {
      alert('No image found');
      return;
    }

    // Upload new image to storage
    if (!galleryFiles || galleryFiles.length === 0) {
      return;
    }

    try {
      const downloadURLs: string[] = [];

      for (const file of galleryFiles) {
        const downloadURL = await uploadImageToFirebaseStorage(file);

        if (downloadURL && downloadURL !== '') {
          downloadURLs.push(downloadURL);
        }
      }
      // Update document image
      const docRef = doc(
        db,
        state.selectedTarget?.collectionName!,
        state.displayingData.id,
      );
      await updateDoc(docRef, {
        images: downloadURLs,
      });

      // Update state
      dispatch({
        type: ManageActionType.SET_DISPLAYING_DATA,
        payload: { ...state.displayingData, images: downloadURLs },
      });
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  //#endregion

  return (
    <RowModalLayout
      handleAddNewRow={handleAddNewRow}
      handleUpdateRow={handleUpdateRow}
    >
      <ProductForm
        galleryURLs={galleryURLs}
        galleryFiles={galleryFiles}
        handleUploadImageToBrowser={handleUploadImageToBrowser}
      />
    </RowModalLayout>
  );
}
