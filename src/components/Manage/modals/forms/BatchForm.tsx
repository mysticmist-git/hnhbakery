import { COLLECTION_NAME } from '@/lib/constants';
import {
  countDocs,
  getCollection,
  getCollectionWithQuery,
  getProductsByType,
} from '@/lib/firestore/firestoreLib';
import { ModalBatchObject, ModalFormProps } from '@/lib/localLib/manage';
import { ProductObject, ProductTypeObject } from '@/lib/models';
import { Autocomplete, TextField } from '@mui/material';
import { where } from 'firebase/firestore';
import { memo, useEffect, useState } from 'react';
import ProductTypeAutocomplete from '../../tables/components/ProductTypeAutocomplete';

interface BatchFormProps extends ModalFormProps {
  data: ModalBatchObject | null;
}

type ProductTypeWithCount = ProductTypeObject & {
  count: number;
};

export default memo(function BatchForm(props: BatchFormProps) {
  //#region States

  const [productTypes, setProductTypes] = useState<ProductTypeObject[]>([]);
  const [selectedProductType, setSelectedProductType] =
    useState<ProductTypeObject | null>(null);

  const [products, setProducts] = useState<ProductObject[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductObject | null>(
    null
  );

  //#endregion

  //#region UseEffects

  useEffect(() => {
    async function fetchProductTypes() {
      let productTypes: ProductTypeWithCount[] = [];

      try {
        const docs = await getCollectionWithQuery<ProductTypeObject>(
          COLLECTION_NAME.PRODUCT_TYPES
        );

        productTypes = await Promise.all(
          docs.map(async (doc) => {
            const typeWithCount: ProductTypeWithCount = {
              ...doc,
              count: await countDocs(
                COLLECTION_NAME.PRODUCTS,
                where('productType_id', '==', doc.id)
              ),
            };

            return typeWithCount;
          })
        );
      } catch (error) {
        console.log(error);
      }
      setProductTypes(() => productTypes);
    }

    fetchProductTypes();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      if (!selectedProductType) return;

      let products: ProductObject[] = [];

      try {
        products = await getProductsByType(selectedProductType.id ?? '');
      } catch (error) {
        console.log(error);
      }

      setProducts(() => products);
    }

    fetchProducts();
  }, [selectedProductType]);

  //#endregion

  //#region Handlers

  function handleProductTypeChange(value: ProductTypeObject) {
    setSelectedProductType(value);
  }

  function handleSelectedProductChange(value: ProductObject) {
    setSelectedProduct(() => value);
  }

  //#endregion

  return (
    <>
      <ProductTypeAutocomplete
        productTypes={productTypes}
        handleProductTypeChange={handleProductTypeChange}
        readOnly={props.readOnly}
        selectedProductType={selectedProductType}
      />

      <Autocomplete
        options={products}
        value={selectedProduct}
        onChange={(e, value) => {
          if (value) handleSelectedProductChange(value);
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </>
  );
});
