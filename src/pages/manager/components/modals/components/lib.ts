import { Theme } from '@mui/material';
import { DocumentData } from 'firebase/firestore';
import { StaticImageData } from 'next/image';
import { RefObject } from 'react';

export interface Props {
  placeholderImage: StaticImageData;
  theme: Theme;
  displayingData: DocumentData;
  setDisplayingData: any;
  featuredImageFile: any;
  setFeaturedImageFile: any;
  featuredImageURL: string;
  setFeaturedImageURL: any;
  uploadInputRef: RefObject<HTMLInputElement>;
  handleUploadImage: any;
  handleDeleteRow: any;
  handleModalClose: any;
}
