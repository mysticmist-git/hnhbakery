import { useState, useRef, RefObject } from 'react';
import {
  Grid,
  Box,
  Typography,
  Divider,
  IconButton,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Theme,
} from '@mui/material';
import { Delete, Close } from '@mui/icons-material';
import Image, { StaticImageData } from 'next/image';
import { DocumentData } from 'firebase/firestore';
import { Props as FormProps } from './lib';
import { CollectionName } from '@/lib/models/utilities';
import ProductTypeForm from './ProductTypeForm';
import BatchForm from './BatchForm';
import ProductForm from './ProductForm';

export interface HubFormProps extends FormProps {
  collectionName: CollectionName;
}

const Form = ({
  collectionName,
  placeholderImage,
  theme,
  displayingData,
  setDisplayingData,
  featuredImageFile,
  setFeaturedImageFile,
  featuredImageURL,
  setFeaturedImageURL,
  uploadInputRef,
  handleUploadImage,
  handleDeleteRow,
  handleModalClose,
}: HubFormProps) => {
  const props = {
    placeholderImage,
    theme,
    displayingData,
    setDisplayingData,
    featuredImageFile,
    setFeaturedImageFile,
    featuredImageURL,
    setFeaturedImageURL,
    uploadInputRef,
    handleUploadImage,
    handleDeleteRow,
    handleModalClose,
  };

  switch (collectionName) {
    case CollectionName.ProductTypes:
      return <ProductTypeForm {...props} />;
    case CollectionName.Products:
      return <ProductForm {...props} />;
    case CollectionName.Batches:
      return <BatchForm {...props} />;
    default:
      return <div>Error loading form</div>;
  }
};

export default Form;
