import { COLLECTION_NAME } from '@/lib/constants';
import {
  FormRef,
  ModalBatchObject,
  ModalProductObject,
  ModalProductTypeObject,
  ProductFormRef,
  ProductTypeFormRef,
} from '@/lib/types/manage';
import {
  ModalBatch,
  ModalProduct,
  ModalProductType,
} from '@/models/storageModels';
import {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { BatchForm, ProductForm, ProductTypeForm } from '..';
import { FormProps } from '../../rowModals/RowModal/RowModal';

const Form = (
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
) => {
  //#region Refs

  const productTypeFormRef = useRef<ProductTypeFormRef>(null);
  const productFormRef = useRef<ProductFormRef>(null);

  useImperativeHandle(
    ref,
    () => {
      const ref: FormRef = {
        getProductTypeFormRef() {
          return productTypeFormRef.current;
        },
        getProductFormRef() {
          return productFormRef.current;
        },
      };

      return ref;
    },
    [productTypeFormRef, productFormRef]
  );

  //#endregion

  const props = useMemo(
    () => ({
      mode,
      readOnly,
      disabled,
      onDataChange,
    }),
    [disabled, mode, onDataChange, readOnly]
  );

  const view = useMemo(() => {
    switch (collectionName) {
      case COLLECTION_NAME.PRODUCT_TYPES:
        return (
          <ProductTypeForm
            {...props}
            data={data as ModalProductType}
            ref={productTypeFormRef}
          />
        );
      case COLLECTION_NAME.PRODUCTS:
        return (
          <ProductForm
            {...props}
            ref={productFormRef}
            data={data as ModalProduct}
          />
        );
      case COLLECTION_NAME.BATCHES:
        return <BatchForm {...props} data={data as ModalBatch} />;
      default:
        return <div>Error</div>;
    }
  }, [collectionName, data, props]);

  return view;
};

export default forwardRef(Form);
