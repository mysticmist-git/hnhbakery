import { DocumentData } from 'firebase/firestore';

export interface Props {
  placeholderImage: any;
  displayingData: DocumentData;
  setDisplayingData: any;

  featuredImageFile: any;
  setFeaturedImageFile: any;
  featuredImageURL: string;
  setFeaturedImageURL: any;

  galleryFiles: any[];
  setGalleryFiles: any;
  galleryURLs: string[];
  setGalleryURLs: any;

  handleUploadImage: any;
  handleDeleteRow: any;
  handleModalClose: any;
  mode: 'create' | 'update';
}
