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

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: '1rem',
          p: 4,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h5" fontWeight={'bold'}>
                Thêm loại sản phẩm mới
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
                mt: '1rem',
              }}
            />
          </Grid>
          <Grid
            item
            lg={6}
            sx={{
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Image
              src={
                featuredImageURL && featuredImageFile !== ''
                  ? featuredImageURL
                  : placeholderImage
              }
              alt="Featuring Image"
              width={240}
              height={240}
              priority
            />

            <Button
              variant="contained"
              sx={{
                borderRadius: '0 0 0.4rem 0.4rem',
                backgroundColor: theme.palette.secondary.main,
                '&:hover': {
                  backgroundColor: theme.palette.secondary.dark,
                },
                textTransform: 'none',
                width: '100%',
              }}
              onClick={() => {
                if (uploadInputRef.current) uploadInputRef.current.click();
              }}
            >
              Tải ảnh lên
              <input
                ref={uploadInputRef}
                type="file"
                onChange={handleUploadImage}
                style={{
                  display: 'none',
                }}
              />
            </Button>
          </Grid>
          <Grid item lg={6}>
            <Box
              sx={{
                display: 'flex',
                gap: '1rem',
                flexDirection: 'column',
              }}
            >
              <TextField
                label="Tên loại sản phẩm"
                variant="standard"
                color="secondary"
                fullWidth
                value={displayingData?.name}
                onChange={(e) =>
                  setDisplayingData({ ...displayingData, name: e.target.value })
                }
              />
              <TextField
                label="Miêu tả"
                color="secondary"
                multiline
                fullWidth
                value={displayingData?.description}
                rows={5}
                onChange={(e) =>
                  setDisplayingData({
                    ...displayingData,
                    description: e.target.value,
                  })
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    color="secondary"
                    checked={displayingData?.isActive}
                    onChange={(e) =>
                      setDisplayingData({
                        ...displayingData,
                        isActive: e.target.checked,
                      })
                    }
                  />
                }
                label={
                  <Typography variant="body1" fontWeight="bold">
                    Còn hoạt động
                  </Typography>
                }
                labelPlacement="start"
                sx={{
                  alignSelf: 'end',
                }}
              />
            </Box>
          </Grid>
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
