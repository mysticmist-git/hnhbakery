import { CustomTextFieldWithLabel } from '@/components/Inputs';
import { COLLECTION_NAME } from '@/lib/constants';
import {
  countDocs,
  getCollectionWithQuery,
  getProductsByType,
} from '@/lib/firestore/firestoreLib';
import { ModalBatchObject, ModalFormProps } from '@/lib/localLib/manage';
import { ProductObject, ProductTypeObject } from '@/lib/models';
import { ProductVariant } from '@/lib/models/Product';
import formatPrice from '@/lib/utilities/formatCurrency';
import {
  Autocomplete,
  Box,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { where } from 'firebase/firestore';
import { memo, useEffect, useState } from 'react';
import ProductTypeAutocomplete from '../../tables/components/ProductTypeAutocomplete';

interface BatchFormProps extends ModalFormProps {
  data: ModalBatchObject | null;
}

type ProductTypeWithCount = ProductTypeObject & {
  count: number;
};

type ProductTypeRenderOptionProps = {
  props: React.HTMLAttributes<HTMLLIElement>;
  option: ProductTypeWithCount;
};

function ProductTypeRenderOption({
  props,
  option,
}: ProductTypeRenderOptionProps) {
  return (
    <Box {...props} component={'li'} key={option.id}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'start',
        }}
      >
        <Typography>{option.name}</Typography>
        <Typography variant="body2">Số sản phẩm: {option.count}</Typography>
      </Box>
    </Box>
  );
}

type ProductVariantRenderOptionProps = {
  props: React.HTMLAttributes<HTMLLIElement>;
  option: ProductVariant;
};

function ProductVariantListItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Stack direction="row" gap={1} alignItems={'center'}>
      <Typography>{`${label}:`}</Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  );
}

function ProductVariantRenderOption({
  props,
  option,
}: ProductVariantRenderOptionProps) {
  return (
    <Box {...props} component={'li'} key={option.id}>
      <Stack>
        <ProductVariantListItem label={'Vật liệu'} value={option.material} />
        <ProductVariantListItem label={'Kích cỡ'} value={option.size} />
        <ProductVariantListItem label={'Giá tiền'} value={option.price} />
      </Stack>
    </Box>
  );
}

export default memo(function BatchForm(props: BatchFormProps) {
  //#region States

  const [productTypes, setProductTypes] = useState<ProductTypeWithCount[]>([]);
  const [selectedProductType, setSelectedProductType] =
    useState<ProductTypeWithCount | null>(null);

  const [products, setProducts] = useState<ProductObject[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductObject | null>(
    null
  );

  const [selectedProductVariant, setSelectedProductVariant] =
    useState<ProductVariant | null>(null);

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

      const haveProductTypes = productTypes.filter((type) => type.count > 0);

      setProductTypes(() => haveProductTypes);
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

  function handleProductTypeChange(value: ProductTypeWithCount | null) {
    setSelectedProductType(() => value);
    setSelectedProduct(() => null);
    setSelectedProductVariant(() => null);
  }

  function handleSelectedProductChange(value: ProductObject | null) {
    setSelectedProduct(() => value);
    setSelectedProductVariant(() => null);
  }

  function handleSelectedProductVariantChange(value: ProductVariant | null) {
    setSelectedProductVariant(() => value);
  }

  //#endregion

  return (
    <>
      <Grid container spacing={1}>
        {/* First grid item */}
        <Grid item xs={6}>
          <Stack gap={2}>
            <Typography>Thông tin lô</Typography>
            <Divider />
            <Autocomplete
              color="secondary"
              title="Loại sản phẩm"
              placeholder="Chọn loại"
              options={productTypes}
              value={selectedProductType}
              onChange={(e, value) => handleProductTypeChange(value)}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <CustomTextFieldWithLabel {...params} label="Loại sẩn phẩm" />
              )}
              renderOption={(props, option) => (
                <ProductTypeRenderOption props={props} option={option} />
              )}
            />

            <Autocomplete
              title="Sản phẩm"
              placeholder="Chọn sản phẩm"
              options={products}
              value={selectedProduct}
              getOptionLabel={(product) => product.name}
              onChange={(e, value) => handleSelectedProductChange(value)}
              renderInput={(params) => (
                <CustomTextFieldWithLabel {...params} label="Sản phẩm" />
              )}
            />

            <Autocomplete
              title="Biến thể"
              placeholder="Chọn biến thể"
              options={selectedProduct?.variants ?? []}
              value={selectedProductVariant}
              onChange={(e, value) => handleSelectedProductVariantChange(value)}
              getOptionLabel={(productVariant) =>
                `${productVariant.material} - ${
                  productVariant.size
                } - ${formatPrice(productVariant.price)}`
              }
              renderInput={(params) => (
                <CustomTextFieldWithLabel {...params} label="Biến thể" />
              )}
              renderOption={(props, option) => (
                <ProductVariantRenderOption props={props} option={option} />
              )}
            />
          </Stack>
        </Grid>

        {/* Second grid item */}
        <Grid item xs={6}></Grid>
      </Grid>
    </>
  );
});
