import theme from '@/styles/themes/lightTheme';
import { Add, Close, Delete } from '@mui/icons-material';
import {
  Modal,
  Grid,
  Typography,
  Button,
  IconButton,
  Divider,
  TextField,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Box } from '@mui/system';
import {
  DocumentData,
  addDoc,
  collection,
  doc,
  updateDoc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { db, storage } from '@/firebase/config';
import { useUploadImage } from '@/lib/hooks/useUploadImage';
import { CollectionName } from '@/lib/models/utilities';
import Image from 'next/image';

import placeholderImage from '@/assets/placeholder-image.png';
import ProductTypeForm from './components/ProductTypeForm';
import Form from './components/Form';

export type ModalMode = 'create' | 'update';

export interface ModalProps {
  collectionName: CollectionName;
  displayingData: DocumentData;
  setDisplayingData: any;
  open: boolean;
  onClose: () => void;
  mainDocs: DocumentData[];
  setMainDocs: any;
  mode: 'create' | 'update';
  setMode: any;
  handleDeleteRow: any;
}

const formStyle = {
  // These 4 below are positionings I used for larger
  // height viewports - centered
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // other styles...
  width: 600,
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

export default function RowModal({
  collectionName,
  displayingData,
  setDisplayingData,
  open,
  onClose,
  mainDocs,
  setMainDocs,
  mode,
  setMode,
  handleDeleteRow,
}: ModalProps) {
  const [
    featuredImageFile,
    setFeaturedImageFile,
    featuredImageURL,
    setFeaturedImageURL,
    uploadInputRef,
  ] = useUploadImage();

  const [originalData, setOriginalData] = useState<DocumentData>({});
  const [originalImageURL, setOriginalImageURL] = useState<string>('');

  console.log(displayingData);

  useEffect(() => {
    if (featuredImageFile) {
      setFeaturedImageURL(URL.createObjectURL(featuredImageFile));
    }
  }, [featuredImageFile]);

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

  useEffect(() => {
    if (!open || mode !== 'update' || !displayingData.image) return;

    setOriginalData(displayingData);

    const getDownloadUrlFromFirebaseStorage = memoize(async () => {
      const imageRef = ref(storage, displayingData.image);
      const url = await getDownloadURL(imageRef);

      return url;
    });

    const getImageUrl = async () => {
      const url = await getDownloadUrlFromFirebaseStorage();
      console.log('Update mode | image url got: ', url);
      setFeaturedImageURL(url);
      setOriginalImageURL(url);
    };

    getImageUrl();
  }, [open]);

  // Handlers
  const handleUploadImage = (event: any) => {
    const file = event.target.files[0];

    setFeaturedImageFile(file);
  };

  const handleModalClose = () => {
    // Clear images data
    setFeaturedImageFile(null);
    setFeaturedImageURL('');

    // Close
    onClose();
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
    // Upload image
    const uploadImageResult = await uploadImageToFirebaseStorage(
      featuredImageFile,
    );

    console.log('Upload image path:', uploadImageResult);

    // Get new row data
    if (!uploadImageResult) return;

    const data = {
      ...displayingData,
      image: uploadImageResult,
    };

    // Upload to Firestore
    const docId = await addDocumentToFirestore(data);

    // Add new row to table data
    setMainDocs([...mainDocs, { ...data, id: docId }]);

    handleModalClose();
  };

  const handleUpdateRow = async () => {
    try {
      const newData = {
        ...displayingData,
        image: featuredImageURL,
      };
      console.log('newData:', newData);

      // Check if image changed
      if (featuredImageURL !== originalImageURL) {
        console.log('Imaged changed detected');
        console.log('Current URL: ', featuredImageURL);
        console.log('Original URL', originalImageURL);
        if (displayingData.image) {
          // Delete old image
          const oldImageRef = ref(storage, displayingData.image);
          await deleteObject(oldImageRef);
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
        setMainDocs(
          mainDocs.map((doc) => {
            if (doc.id === displayingData.id) {
              return { ...newData, id: doc.id };
            }
            return doc;
          }),
        );
      }

      handleModalClose();
    } catch (error) {
      console.log('Update row failed, error: ', error);
    }
  };

  const getTitle = () => {
    switch (collectionName) {
      case CollectionName.ProductTypes:
        return mode === 'create' ? 'Thêm loại sản phẩm mới' : 'Loại sản phẩm';
      case CollectionName.Products:
        return mode === 'create' ? 'Thêm sản phẩm mới' : 'Sản phẩm';
      case CollectionName.Batches:
        return mode === 'create' ? 'Thêm lô hàng mới' : 'Lô hàng';
      default:
        return 'Error loading title';
    }
  };

  return (
    <Modal
      open={open}
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
              <IconButton onClick={handleDeleteRow} color="secondary">
                <Delete />
              </IconButton>
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

        <Form
          collectionName={collectionName}
          placeholderImage={placeholderImage}
          theme={theme}
          displayingData={displayingData}
          setDisplayingData={setDisplayingData}
          featuredImageFile={featuredImageFile}
          setFeaturedImageFile={setFeaturedImageFile}
          featuredImageURL={featuredImageURL}
          setFeaturedImageURL={setFeaturedImageURL}
          uploadInputRef={uploadInputRef}
          handleUploadImage={handleUploadImage}
          handleDeleteRow={handleDeleteRow}
          handleModalClose={handleModalClose}
        />
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
              {mode === 'update' && (
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
              {mode === 'create' && (
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
  );
}
