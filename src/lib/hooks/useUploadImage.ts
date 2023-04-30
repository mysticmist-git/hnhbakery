import { useState, useRef } from 'react';

export const useUploadImage = () => {
  const [featuredImageFile, setFeaturedImageFile] = useState<any>(null);
  const [featuredImageURL, setFeaturedImageURL] = useState<string>('');

  const uploadInputRef = useRef<HTMLInputElement>(null);

  return [
    featuredImageFile,
    setFeaturedImageFile,
    featuredImageURL,
    setFeaturedImageURL,
    uploadInputRef,
  ];
};
