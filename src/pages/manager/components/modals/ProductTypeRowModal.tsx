import { DocumentData, doc, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { deleteObject, ref } from 'firebase/storage';
import { db, storage } from '@/firebase/config';

import { ManageContextType, ManageActionType } from '../../lib/manage';
import { ManageContext } from '../../manage';
import ProductTypeForm from './forms/ProductTypeForm';
import RowModalLayout from './RowModalLayout';
import { CollectionName } from '@/lib/models/utilities';
import {
  getDownloadUrlsFromFirebaseStorage,
  uploadImageToFirebaseStorage,
  addDocumentToFirestore,
  updateDocument,
} from '../../lib/firebaseLib';
import { checkIfDataChanged, isDataChanged } from './lib';

export default function ProductTypeRowModal() {
  //#region States

  const {
    state,
    dispatch,
    handleDeleteRow,
    handleViewRow,
    resetDisplayingData,
  } = useContext<ManageContextType>(ManageContext);

  /**
   * This is used to stored URL of the featured on storage
   * If this changed to local URL, that's mean we need to update the image
   */
  const [originalDisplayingData, setOriginalDisplayingData] =
    useState<DocumentData | null>(null);
  const [originalFeaturedImageURL, setOriginalFeaturedImageURL] = useState<
    string | null
  >(null);

  // Image manage
  const [featuredImageURL, setFeaturedImageURL] = useState<string | null>(null);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);

  //#endregion

  //#region Hooks

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

    let downloadURL: string | null = null;

    async function ExecuteGetDownloadURLAndLoadImageToView() {
      downloadURL = await GetDownloadURLAndLoadImageToView(
        state.displayingData!.image,
      );
    }

    ExecuteGetDownloadURLAndLoadImageToView();

    if (downloadURL) setOriginalFeaturedImageURL(downloadURL);
  }, []);

  useEffect(() => {
    if (featuredImageFile) {
      setFeaturedImageURL(URL.createObjectURL(featuredImageFile));
    }
  }, [featuredImageFile]);

  useEffect(() => {
    if (!featuredImageURL) return;
  }, [featuredImageURL]);

  //#endregion

  //#region Functions

  function loadImageToView(image: string) {
    if (!image || image.length === 0) return;

    setFeaturedImageURL(image);
  }

  async function GetDownloadURLAndLoadImageToView(
    image: string,
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
    if (!originalFeaturedImageURL) {
      alert('No original image URL found');
      return false;
    }

    if (!featuredImageURL) {
      alert('No image URL found');
      return false;
    }

    return originalFeaturedImageURL !== featuredImageURL;
  }

  async function updateImageToFirebaseStorage() {
    if (!checkIfImageChanged()) return;

    // Remove old image from storage
    if (state.displayingData?.image) {
      try {
        const imageRef = ref(storage, state.displayingData.image);
        await deleteObject(imageRef);
      } catch (error) {
        console.log('Error: ', error);
      }
    } else {
      alert('No image found');
      return;
    }

    // Upload new image to storage
    if (featuredImageFile) {
      try {
        const downloadURL = await uploadImageToFirebaseStorage(
          featuredImageFile,
        );

        // Update document image
        const docRef = doc(
          db,
          state.selectedTarget?.collectionName!,
          state.displayingData.id,
        );
        await updateDoc(docRef, {
          image: downloadURL,
        });

        // Update state
        dispatch({
          type: ManageActionType.SET_DISPLAYING_DATA,
          payload: { ...state.displayingData, image: downloadURL },
        });
      } catch (error) {
        console.log('Error: ', error);
      }
    } else {
      alert('No image found');
    }
  }

  //#endregion

  //#region Hanlders

  const handleUploadImageToBrowser = (event: any) => {
    const file = event.target.files[0];

    if (file) setFeaturedImageFile(file);
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

    const collectionName = state.selectedTarget?.collectionName;

    if (!collectionName) return;

    // Image existence check
    if (!featuredImageFile) {
      alert('No image received');
      return;
    }

    try {
      // Upload image
      const imageURL = await uploadImageToFirebaseStorage(featuredImageFile);

      // Image upload fail
      if (!imageURL) {
        alert('Image upload fial');
        return;
      }

      const data = {
        ...state.displayingData,
        image: imageURL,
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
    }

    // Close modal
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

      if (imageChanged) updateImageToFirebaseStorage();

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

  return (
    <RowModalLayout
      handleAddNewRow={handleAddNewRow}
      handleUpdateRow={handleUpdateRow}
    >
      <ProductTypeForm
        featuredImageURL={featuredImageURL}
        handleUploadImage={handleUploadImageToBrowser}
      />
    </RowModalLayout>
  );
}
