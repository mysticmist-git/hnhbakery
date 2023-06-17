import { COLLECTION_NAME } from '@/lib/constants';
import {
  FormRef,
  ModalProductTypeObject,
  ProductTypeFormRef,
} from '@/lib/localLib/manage';
import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from 'react';
import { ProductTypeForm } from '../forms';
import { FormProps } from '../rowModals/RowModal';

const DEFAULT_REF = {};

export default forwardRef(function Form(
  { data, collectionName, onDataChange, mode, readOnly }: FormProps,
  ref: ForwardedRef<FormRef>
) {
  //#region Refs

  const productTypeFormRef = useRef<ProductTypeFormRef>(null);

  useImperativeHandle(
    ref,
    () => {
      return {
        getProductTypeFormRef() {
          return productTypeFormRef.current;
        },
      };
    },
    [productTypeFormRef, collectionName]
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
        />
      );
    case COLLECTION_NAME.PRODUCTS:
      return <div>Not implemented yet</div>;
    // return <ProductForm data={data as ModalProductObject} />;
    case COLLECTION_NAME.BATCHES:
      return <div>Not implemented yet</div>;
    // return <BatchForm data={data as ModalBatchObject} />;
    default:
      return <div>Error</div>;
  }
});
