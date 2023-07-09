import { COLLECTION_NAME } from '@/lib/constants';
import {
  FormRef,
  ModalBatchObject,
  ModalProductObject,
  ModalProductTypeObject,
  ProductFormRef,
  ProductTypeFormRef,
} from '@/lib/types/manage';
import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from 'react';
import { BatchForm, ProductForm, ProductTypeForm } from '..';
import { FormProps } from '../../rowModals/RowModal';

export default forwardRef(function Form(
  {
    data,
    collectionName,
    onDataChange,
    mode,
    readOnly,
    disabled = false,
    loading = false,
  }: FormProps,
  ref: ForwardedRef<FormRef>
) {
  //#region Refs

  const productTypeFormRef = useRef<ProductTypeFormRef>(null);
  const productFormRef = useRef<ProductFormRef>(null);

  useImperativeHandle(
    ref,
    () => {
      return {
        getProductTypeFormRef() {
          return productTypeFormRef.current;
        },
        getProductFormRef() {
          return productFormRef.current;
        },
      };
    },
    [productTypeFormRef, productFormRef, collectionName]
  );

  //#endregion

  const props = {
    mode,
    readOnly,
    disabled,
    onDataChange,
  };

  switch (collectionName) {
    case COLLECTION_NAME.PRODUCT_TYPES:
      return (
        <ProductTypeForm
          {...props}
          data={data as ModalProductTypeObject}
          ref={productTypeFormRef}
        />
      );
    case COLLECTION_NAME.PRODUCTS:
      return (
        <ProductForm
          {...props}
          ref={productFormRef}
          data={data as ModalProductObject}
        />
      );
    case COLLECTION_NAME.BATCHES:
      return <BatchForm {...props} data={data as ModalBatchObject} />;
    default:
      return <div>Error</div>;
  }
});
