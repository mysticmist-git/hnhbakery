import { useState, useRef } from 'react';

export const useUploadFeaturedImage = () => {
  const [featuredImageFile, setFeaturedImageFile] = useState<any>(null);
  const [featuredImageURL, setFeaturedImageURL] = useState<string>('');

  return {
    featuredImageFile,
    setFeaturedImageFile,
    featuredImageURL,
    setFeaturedImageURL,
  };
};

export const useUploadGallery = () => {
  const [galleryFiles, setGalleryFiles] = useState<any[]>([]);
  const [galleryURLs, setGalleryURLs] = useState<string[]>([]);

  return { galleryFiles, setGalleryFiles, galleryURLs, setGalleryURLs };
};
