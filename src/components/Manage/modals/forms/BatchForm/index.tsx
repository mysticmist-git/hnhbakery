import { CustomTextFieldWithLabel } from '@/components/Inputs/textFields';
import { COLLECTION_NAME } from '@/lib/constants';
import {
  getCollectionWithQuery,
  getDocFromFirestore,
  getProductTypeWithCount,
  getProductTypeWithCountById,
  getProductsByType,
} from '@/lib/firestore';
import {
  ProductObject,
  ProductTypeObject,
  ProductTypeWithCount,
  ProductVariant,
} from '@/lib/models';
import { ModalBatchObject, ModalFormProps } from '@/lib/types/manage';
import { formatPrice } from '@/lib/utils';
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
import { memo, useEffect, useState } from 'react';
import CustomDateTimePicker from './CustomDateTimePicker';
import ProductTypeRenderOption from './ProductTypeRenderOption';
import ProductVariantRenderOption from './ProductVariantRenderOption';

interface BatchFormProps extends ModalFormProps {
  data: ModalBatchObject | null;
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

  const [discountAmount, setDiscountAmount] = useState<number>(0);

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

      let product: ProductObject | null = null;

      try {
        product = await getDocFromFirestore<ProductObject>(
          COLLECTION_NAME.PRODUCTS,
          props.data.product_id
        );
      } catch (error) {
        console.log(error);
      }

      if (!product) return;

      let productType: ProductTypeWithCount | null = null;

      try {
        productType = await getProductTypeWithCountById(product.productType_id);
      } catch (error) {
        console.log(error);
      }

      setSelectedProductType(() => productType);

      if (product) {
        setSelectedProduct(() => product);
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

  useEffect(() => {
    setDiscountAmount(() => calculateDiscountMoney());
  }, [props.data?.discount.percent]);

  useEffect(() => {
    if (!selectedProduct) return;

    handleFieldChange('product_id', selectedProduct.id);
  }, [selectedProduct]);

  useEffect(() => {
    if (!selectedProductVariant) return;

    handleFieldChange('variant_id', selectedProductVariant.id);
  }, [selectedProductVariant]);

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

  function handleFieldChange<
    Property extends keyof ModalBatchObject
  >(property: Property, value: ModalBatchObject[Property]) {
    if (!props.data) return;

    const newData: ModalBatchObject = {
      ...props.data,
      [property]: value,
    };

    props.onDataChange(newData);
  }

  //#endregion

  //#region Methods

  function calculateDiscountMoney(): number {
    if (!selectedProductVariant || !props.data) return 0;

    return (selectedProductVariant.price * props.data.discount.percent) / 100;
  }

  //#endregion

  //#region Functions

  function checkShouldDisableDiscountDate(day: dayjs.Dayjs) {
    const shouldDisabled =
      day.isBefore(props.data?.MFG) || day.isAfter(props.data?.EXP);
    return shouldDisabled;
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

            {/* TODO: Chỉnh cho cái đồng hồ nó không bị mất màu */}
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

            {/* TODO: Chỉnh cái đồng hồ không bị mất màu */}
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

            {/* TODO: Chỉnh cái đồng hồ không bị mất màu */}
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
