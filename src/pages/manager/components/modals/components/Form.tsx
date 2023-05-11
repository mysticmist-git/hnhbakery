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
  displayingData,
  setDisplayingData,

  featuredImageFile,
  setFeaturedImageFile,
  featuredImageURL,
  setFeaturedImageURL,

  galleryFiles,
  setGalleryFiles,
  galleryURLs,
  setGalleryURLs,

  handleUploadImage,
  handleDeleteRow,
  handleModalClose,
  mode,
}: HubFormProps) => {
  const props = {
    placeholderImage,
    displayingData,
    setDisplayingData,

    featuredImageFile,
    setFeaturedImageFile,
    featuredImageURL,
    setFeaturedImageURL,

    galleryFiles,
    setGalleryFiles,
    galleryURLs,
    setGalleryURLs,

    handleUploadImage,
    handleDeleteRow,
    handleModalClose,
    mode,
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
