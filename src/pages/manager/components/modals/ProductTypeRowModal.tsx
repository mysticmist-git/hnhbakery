import {
  DocumentData,
  addDoc,
  collection,
  doc,
  updateDoc,
} from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { deleteObject, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '@/firebase/config';
import { useUploadFeaturedImage } from '@/lib/hooks/useUploadImage';
import { CollectionName } from '@/lib/models/utilities';

import { ManageContextType, ManageActionType } from '../../lib/manage';
import { ManageContext } from '../../manage';
import ProductTypeForm from './ProductTypeForm';
import RowModalLayout from './RowModalLayout';
import { RowModalContext } from './ProductRowModal';
import {
  addDocumentToFirestore,
  getDownloadUrlsFromFirebaseStorage,
  uploadImageToFirebaseStorage,
} from './lib';

export default function ProductTypeRowModal() {
  //#region States

  const {
    state,
    dispatch,
    handleDeleteRow,
    handleViewRow,
    resetDisplayingData,
  } = useContext<ManageContextType>(ManageContext);

  const {
    featuredImageFile,
    setFeaturedImageFile,
    featuredImageURL,
    setFeaturedImageURL,
  } = useUploadFeaturedImage();
  const [originalImageURL, setOriginalImageURL] = useState<string>('');
  const [originalData, setOriginalData] = useState<DocumentData>({});

  //#endregion

  //#region useEffects

  useEffect(() => {
    if (featuredImageFile) {
      setFeaturedImageURL(URL.createObjectURL(featuredImageFile));
    }
  }, [featuredImageFile]);

  // This useEffect load image
  useEffect(() => {
    if (
      state.crudModalOpen ||
      state.crudModalMode !== 'update' ||
      !state.displayingData?.image
    )
      return;

    setOriginalData(state.displayingData ?? {});

    const getImageUrl = async () => {
      // Depends on fetched data, it may have either image or images fields

      if (state.displayingData?.image) {
        const featuredURL: string[] = await getDownloadUrlsFromFirebaseStorage([
          state.displayingData.image,
        ]);

        if (featuredURL && featuredURL.length > 0) {
          setFeaturedImageURL(featuredURL[0]);
          setOriginalImageURL(featuredURL[0]);
        }
      }
    };

    getImageUrl();
  }, [state.crudModalOpen]);

  //#endregion

  //#region Hanlders

  const handleUploadImage = (event: any) => {
    const file = event.target.files[0];

    setFeaturedImageFile(file);
  };

  //#endregion

  // Handlers

  /**
   * Adds a new document to Firestore collection.
   *
   * @param {Object} data - The data to be added to Firestore.
   * @return {string} The ID of the newly created document.
   * @throws {Error} If there is an error adding the new document to Firestore.
   */

  const handleAddNewRow = async () => {
    const collectionName = state.displayingData?.collectionName;

    if (!collectionName) return;

    // Check if image upload needed
    let data = { ...state.displayingData };

    if (featuredImageFile) {
      // Upload image
      const uploadImageResult = await uploadImageToFirebaseStorage(
        featuredImageFile,
      );

      console.log('Upload image path:', uploadImageResult);

      // Get new row data
      if (!uploadImageResult) return;

      data = {
        ...state.displayingData,
        image: uploadImageResult,
      };
    }

    // Upload to Firestore
    const docId = await addDocumentToFirestore(data, collectionName);

    // Add new row to table data
    dispatch({
      type: ManageActionType.SET_MAIN_DOCS,
      payload: [...state.mainDocs, { ...data, id: docId }],
    });
  };

  const handleUpdateRow = async () => {
    try {
      const newData = {
        ...state.displayingData,
        image: featuredImageURL,
      };
      console.log('newData:', newData);

      const collectionName = state.displayingData?.collectionName;
      const displayingData = state.displayingData;

      if (!collectionName || !displayingData) {
        alert('Errror at handleUpdateRow RowModal!');
        return;
      }

      // Check if image changed
      if (featuredImageURL !== originalImageURL) {
        console.log('Imaged changed detected');
        console.log('Current URL: ', featuredImageURL);
        console.log('Original URL', originalImageURL);
        if (state.displayingData?.image) {
          // Delete old image
          const oldImageRef = ref(storage, state.displayingData.image);
          await deleteObject(oldImageRef);
        } else {
          alert('Errror at handleUpdateRow RowModal!');
          return;
        }

        // Upload new image
        const url = await uploadImageToFirebaseStorage(featuredImageFile);
        newData.image = url;
      }

      console.log('newData after image check:', newData);

      /**
       * Checks if any data in newData is different from displayingData.
       *
       * @param newData - An object containing new data.
       * @param displayingData - An object containing data currently being displayed.
       * @returns A boolean indicating if any data has changed.
       */
      const dataChanged = (
        newData: Record<string, unknown>,
        displayingData: Record<string, unknown>,
      ): boolean => {
        const changed = Object.keys(newData).some(
          (key) => newData[key] !== displayingData[key],
        );
        console.log('dataChanged:', changed);
        return changed;
      };

      if (dataChanged(newData, originalData)) {
        // Update on Firestore
        const docRef = doc(db, collectionName, displayingData.id);
        console.log('docRef:', docRef);
        await updateDoc(docRef, newData);

        // Update on table
        dispatch({
          type: ManageActionType.SET_MAIN_DOCS,
          payload: state.mainDocs.map((doc) => {
            if (doc.id === displayingData.id) {
              return { ...newData, id: doc.id };
            }
            return doc;
          }),
        });
      }
    } catch (error) {
      console.log('Update row failed, error: ', error);
    }
  };

  return (
    <RowModalLayout
      handleAddNewRow={handleAddNewRow}
      handleUpdateRow={handleUpdateRow}
    >
      <ProductTypeForm
        featuredImageURL={featuredImageURL}
        featuredImageFile={featuredImageFile}
        handleUploadImage={handleUploadImage}
      />
    </RowModalLayout>
  );
}
