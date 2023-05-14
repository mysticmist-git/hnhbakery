import theme from '@/styles/themes/lightTheme';
import { Add, Close, Delete, RestartAlt } from '@mui/icons-material';
import {
  Modal,
  Grid,
  Typography,
  Button,
  IconButton,
  Divider,
} from '@mui/material';
import { Box } from '@mui/system';
import {
  DocumentData,
  addDoc,
  collection,
  doc,
  updateDoc,
} from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { db, storage } from '@/firebase/config';
import {
  useUploadFeaturedImage,
  useUploadGallery,
} from '@/lib/hooks/useUploadImage';
import { CollectionName } from '@/lib/models/utilities';

import placeholderImage from '@/assets/placeholder-image.png';
import { ManageContextType, ManageActionType } from '../../lib/manage';
import { ManageContext } from '../../manage';
import ProductForm from './ProductForm';

const formStyle = {
  // These 4 below are positionings I used for larger
  // height viewports - centered
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // other styles...
  width: 840,
  bgcolor: 'background.paper',
  borderRadius: '1rem',
  boxShadow: 24,
  p: 4,
  marginTop: '2rem',
  // media query @ the max height you want (my case is the
  // height of the viewport before the cutoff phenomenon) -
  // set the top to '0' and translate the previous 'y'
  // positioning coordinate so the top of the modal is @ the
  // top of the viewport
  '@media(max-height: 890px)': {
    top: '0',
    transform: 'translate(-50%, 0%)',
  },
};

export interface RowModalContextType {
  getDownloadUrlsFromFirebaseStorage: any;
}

export const RowModalContext = createContext<RowModalContextType>({
  getDownloadUrlsFromFirebaseStorage: () => {},
});

export default function ProductRowModal() {
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
  const [originalGalleryURLs, setOriginalGalleryURLs] = useState<string[]>([]);

  // Get image if there's any
  const memoize = (fn: any) => {
    const cache = new Map();
    return async (...args: any[]) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = await fn(...args);
      cache.set(key, result);
      return result;
    };
  };

  const getDownloadUrlsFromFirebaseStorage = memoize(
    async (paths: string[]) => {
      const promises = paths.map((path) => getDownloadURL(ref(storage, path)));
      const urls = await Promise.all(promises);
      return urls;
    },
  );

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

  const handleUploadImage = (event: any) => {
    const file = event.target.files[0];

    setFeaturedImageFile(file);
  };

  // useEffect(() => {
  //   if (
  //     !open ||
  //     state.crudModalMode !== 'update' ||
  //     (!state.displayingData?.image && !state.displayingData?.images)
  //   )
  //     return;

  //   setOriginalData(state.displayingData ?? {});

  //   const getImageUrl = async () => {
  //     // Depends on fetched data, it may have either image or images fields

  //     if (state.displayingData?.images) {
  //       const galleryURLs: string[] = await getDownloadUrlsFromFirebaseStorage(
  //         state.displayingData.images,
  //       );

  //       if (galleryURLs && galleryURLs.length > 0) {
  //         console.log(galleryURLs);
  //         setGalleryURLs(galleryURLs);
  //         setOriginalGalleryURLs(galleryURLs);
  //       }
  //     }
  //   };

  //   getImageUrl();
  // }, [open]);

  // Handlers

  const handleModalClose = () => {
    // Clear images data
    // setFeaturedImageFile(null);
    // setFeaturedImageURL('');

    // Close
    dispatch({
      type: ManageActionType.SET_CRUD_MODAL_OPEN,
      payload: false,
    });
  };

  /**
   * Adds a new document to Firestore collection.
   *
   * @param {Object} data - The data to be added to Firestore.
   * @return {string} The ID of the newly created document.
   * @throws {Error} If there is an error adding the new document to Firestore.
   */

  const addDocumentToFirestore = async (
    data: DocumentData,
    collectionName: CollectionName,
  ): Promise<string> => {
    try {
      delete data.id;

      const docRef = await addDoc(collection(db, collectionName), data);
      console.log('Document written with ID: ', docRef.id);
      return docRef.id;
    } catch (e) {
      console.log('Error adding new document to firestore: ', e);
      return '';
    }
  };

  /**
   * Uploads an image file to Firebase storage.
   *
   * @param {any} imageFile - The image file to upload.
   * @return {Promise<string>} - A promise that resolves with the full path of the uploaded image file in Firebase storage.
   *    If the upload fails, the promise resolves with an empty string.
   */

  const uploadImageToFirebaseStorage = async (
    imageFile: any,
  ): Promise<string> => {
    const storageRef = ref(storage, `images/${imageFile.name}`);
    const file = imageFile;

    try {
      const uploadImage = await uploadBytes(storageRef, file);
      return uploadImage.metadata.fullPath;
    } catch (error) {
      console.log('Image upload fail, error: ', error);
      return '';
    }
  };

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

    handleModalClose();
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

      handleModalClose();
    } catch (error) {
      console.log('Update row failed, error: ', error);
    }
  };

  const getTitle = () => {
    const collectionName = state.displayingData?.collectionName;

    if (!collectionName) return 'Error loading title';

    switch (collectionName) {
      case CollectionName.ProductTypes:
        return state.crudModalMode === 'create'
          ? 'Thêm loại sản phẩm mới'
          : 'Loại sản phẩm';
      case CollectionName.Products:
        return state.crudModalMode === 'create'
          ? 'Thêm sản phẩm mới'
          : 'Sản phẩm';
      case CollectionName.Batches:
        return state.crudModalMode === 'create'
          ? 'Thêm lô hàng mới'
          : 'Lô hàng';
      default:
        return 'Error loading title';
    }
  };

  const handleResetForm = () => {};

  return (
    <RowModalContext.Provider
      value={{
        getDownloadUrlsFromFirebaseStorage,
      }}
    >
      <Modal
        open={state.crudModalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          overflowY: 'scroll',
        }}
        disableScrollLock={false}
      >
        <Box sx={formStyle}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h5" fontWeight={'bold'}>
                {getTitle()}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                {state.crudModalMode === 'update' ? (
                  <IconButton onClick={handleDeleteRow} color="secondary">
                    <Delete />
                  </IconButton>
                ) : (
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: 'common.gray',
                      '&:hover': {
                        backgroundColor: 'common.darkGray',
                      },
                      paddingX: '1rem',
                      borderRadius: '1rem',
                    }}
                    onClick={() => resetDisplayingData()}
                    startIcon={<RestartAlt />}
                  >
                    Đặt lại
                  </Button>
                )}
                <IconButton onClick={handleModalClose}>
                  <Close />
                </IconButton>
              </Box>
            </Box>
            <Divider
              sx={{
                my: '1rem',
              }}
            />
          </Grid>

          <ProductForm />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Divider
                sx={{
                  my: '1rem',
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'end',
                  gap: '0.7rem',
                }}
              >
                {state.crudModalMode === 'update' && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{
                      borderRadius: '1rem',
                      textTransform: 'none',
                    }}
                    onClick={handleUpdateRow}
                  >
                    Cập nhật
                  </Button>
                )}
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: theme.palette.common.gray,
                    '&:hover': {
                      backgroundColor: theme.palette.common.light,
                    },
                    paddingX: '1.5rem',
                    borderRadius: '1rem',
                  }}
                  onClick={handleModalClose}
                >
                  Thoát
                </Button>
                {state.crudModalMode === 'create' && (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: theme.palette.secondary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.secondary.dark,
                      },
                      paddingX: '1.5rem',
                      borderRadius: '1rem',
                    }}
                    onClick={handleAddNewRow}
                    startIcon={<Add />}
                  >
                    Thêm
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </RowModalContext.Provider>
  );
}
