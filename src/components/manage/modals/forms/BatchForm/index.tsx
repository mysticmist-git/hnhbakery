import { CustomTextFieldWithLabel } from '@/components/inputs/textFields';
import { getProduct } from '@/lib/DAO/productDAO';
import { getProductTypes } from '@/lib/DAO/productTypeDAO';
import { COLLECTION_NAME } from '@/lib/constants';
import {
  getCollectionWithQuery,
  getDocFromFirestore,
  getProductTypeWithCount,
  getProductTypeWithCountById,
  getProductsByType,
} from '@/lib/firestore';
import { ProductObject, ProductTypeObject, ProductVariant } from '@/lib/models';
import { ModalBatchObject, ModalFormProps } from '@/lib/types/manage';
import { formatPrice } from '@/lib/utils';
import Product from '@/models/product';
import { ModalBatch, ProductTypeWithCount } from '@/models/storageModels';
import Variant from '@/models/variant';
import {
  Autocomplete,
  Divider,
  Grid,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import { renderTimeViewClock } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { memo, useCallback, useEffect, useState } from 'react';
import CustomDateTimePicker from './CustomDateTimePicker';
import ProductTypeRenderOption from './ProductTypeRenderOption';
import ProductVariantRenderOption from './ProductVariantRenderOption';

interface BatchFormProps extends ModalFormProps {
  data: ModalBatch | null;
}

export default memo(function BatchForm(props: BatchFormProps) {
  //#region States

  const [productTypes, setProductTypes] = useState<ProductTypeWithCount[]>([]);
  const [selectedProductType, setSelectedProductType] =
    useState<ProductTypeWithCount | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [selectedProductVariant, setSelectedProductVariant] =
    useState<Variant | null>(null);

  const [discountAmount, setDiscountAmount] = useState<number>(0);

  //#endregion

  //#region Methods

  const calculateDiscountMoney = useCallback((): number => {
    if (!selectedProductVariant || !props.data) return 0;

    return (selectedProductVariant.price * props.data.discount.percent) / 100;
  }, [props.data, selectedProductVariant]);

  const handleFieldChange = useCallback(
    <Property extends keyof ModalBatch>(
      property: Property,
      value: ModalBatch[Property]
    ) => {
      if (!props.data) return;

      const newData: ModalBatch = {
        ...props.data,
        [property]: value,
      };

      props.onDataChange(newData);
    },
    [props]
  );

  //#endregion

  //#region Functions

  function checkShouldDisableDiscountDate(day: dayjs.Dayjs) {
    const shouldDisabled =
      day.isBefore(props.data?.mfg) || day.isAfter(props.data?.exp);
    return shouldDisabled;
  }

  //#endregion

  //#region UseEffects

  useEffect(() => {
    async function fetchProductTypes() {
      let productTypes: ProductTypeWithCount[] = [];

      try {
        const docs = await getProductTypes();

        productTypes = await Promise.all(
          docs.map(async (doc) => await getProductTypeWithCount(doc))
        );
      } catch (error) {
        console.log(error);
      }

      const haveProductTypes = productTypes.filter((type) => type.count > 0);

      setProductTypes(() => haveProductTypes);
    }

    async function fetchNeededDataForView() {
      if (!props.data) return;
      if (!props.data.product_id) return;

      let product: Product | null = null;

      try {
        product =
          (await getProduct(
            props.data.product_type_id,
            props.data.product_id
          )) ?? null;
      } catch (error) {
        console.log(error);
      }

      if (!product) return;

      let productType: ProductTypeWithCount | null = null;

      try {
        productType = await getProductTypeWithCountById(
          product.product_type_id
        );
      } catch (error) {
        console.log(error);
      }

      setSelectedProductType(() => productType);

      if (product) {
        setSelectedProduct(product);
        setSelectedProductVariant(
          () =>
            product?.variants.find(
              (variant) => variant.id === props.data?.variant_id
            ) ?? null
        );
      }
    }

    fetchProductTypes();
    fetchNeededDataForView();
  }, [props.data]);

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

  useEffect(() => {
    setDiscountAmount(() => calculateDiscountMoney());
  }, [calculateDiscountMoney, props.data?.discount.percent]);

  useEffect(() => {
    if (!selectedProduct) return;

    handleFieldChange('product_id', selectedProduct.id);
  }, [handleFieldChange, selectedProduct]);

  useEffect(() => {
    if (!selectedProductVariant) return;

    handleFieldChange('variant_id', selectedProductVariant.id);
  }, [handleFieldChange, selectedProductVariant]);

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
            {/* General */}
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
                <CustomTextFieldWithLabel {...params} label="Loại sản phẩm" />
              )}
              renderOption={(props, option) => (
                <ProductTypeRenderOption props={props} option={option} />
              )}
              readOnly={props.readOnly}
              disabled={props.disabled}
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
              readOnly={props.readOnly}
              disabled={props.disabled}
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
              readOnly={props.readOnly}
              disabled={props.disabled}
            />
          </Stack>
        </Grid>

        {/* Second grid item */}
        <Grid item xs={6}>
          <Stack gap={2}>
            {/* Detail */}
            <Typography>Chi tiết</Typography>
            <Divider />
            <CustomTextFieldWithLabel
              label="Số sản phẩm"
              value={props.data?.totalQuantity.toString()}
              type="number"
              onChange={(e) =>
                handleFieldChange(
                  'totalQuantity',
                  parseInt(e.target.value) || 0
                )
              }
              disabled={props.disabled}
              InputProps={{
                readOnly: props.readOnly,
              }}
            />

            <CustomDateTimePicker
              label="Sản xuất lúc"
              value={dayjs(props.data?.MFG)}
              disablePast
              onChange={(value) => {
                if (value) handleFieldChange('MFG', value.toDate());
              }}
              readOnly={props.readOnly}
              disabled={props.disabled}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
            />

            <CustomDateTimePicker
              label="Hết hạn lúc"
              value={dayjs(props.data?.EXP)}
              shouldDisableDate={(day) => day.isBefore(props.data?.MFG)}
              onChange={(value) => {
                if (value) handleFieldChange('EXP', value.toDate());
              }}
              readOnly={props.readOnly}
              disabled={props.disabled}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
            />
          </Stack>
        </Grid>

        {/* Third grid item */}
        <Grid item xs={12}>
          <Stack gap={2}>
            {/* Discount */}
            <Typography>Chi tiết</Typography>
            <Divider />

            <Grid container spacing={1}>
              <Grid item xs={6}>
                <CustomTextFieldWithLabel
                  label="Tỉ lệ giảm"
                  value={props.data?.discount.percent.toString() ?? ''}
                  onChange={(e) => {
                    if (props.data)
                      handleFieldChange('discount', {
                        ...props.data.discount,
                        percent: parseInt(e.target.value) || 0,
                      });
                  }}
                  fullWidth
                  InputProps={{
                    readOnly: props.readOnly,
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                  disabled={props.disabled}
                />
              </Grid>
              <Grid item xs={6}>
                <CustomTextFieldWithLabel
                  disabled
                  label="Số tiền giảm"
                  value={formatPrice(calculateDiscountMoney())}
                  fullWidth
                  inputProps={{
                    readOnly: props.readOnly,
                  }}
                />
              </Grid>
            </Grid>

            <CustomDateTimePicker
              label="Bắt đầu từ"
              value={dayjs(props.data?.discount.date)}
              shouldDisableDate={checkShouldDisableDiscountDate}
              onChange={(value) => {
                if (props.data && value)
                  handleFieldChange('discount', {
                    ...props.data.discount,
                    date: value.toDate(),
                  });
              }}
              readOnly={props.readOnly}
              disabled={props.disabled}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
            />
          </Stack>
        </Grid>
      </Grid>
    </>
  );
});
