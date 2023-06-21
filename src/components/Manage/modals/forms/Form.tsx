import { COLLECTION_NAME } from '@/lib/constants';
import {
  FormRef,
  ModalProductObject,
  ModalProductTypeObject,
  ProductFormRef,
  ProductTypeFormRef,
} from '@/lib/localLib/manage';
import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from 'react';
import { ProductForm, ProductTypeForm } from '../forms';
import { FormProps } from '../rowModals/RowModal';

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

  switch (collectionName) {
    case COLLECTION_NAME.PRODUCT_TYPES:
      return (
        <ProductTypeForm
          data={data as ModalProductTypeObject}
          readOnly={readOnly}
          mode={mode}
          onDataChange={onDataChange}
          ref={productTypeFormRef}
          disabled={disabled}
        />
      );
    case COLLECTION_NAME.PRODUCTS:
      return (
        <ProductForm
          ref={productFormRef}
          data={data as ModalProductObject}
          disabled={disabled}
          readOnly={readOnly}
          mode={mode}
          onDataChange={onDataChange}
        />
      );
    // return <ProductForm data={data as ModalProductObject} />;
    case COLLECTION_NAME.BATCHES:
      return <div>Not implemented yet</div>;
    // return <BatchForm data={data as ModalBatchObject} />;
    default:
      return <div>Error</div>;
  }
});
