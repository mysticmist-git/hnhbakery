import { CustomTextFieldWithLabel } from '@/components/inputs/textFields';
import { auth } from '@/firebase/config';
import { getBranchByManager } from '@/lib/DAO/branchDAO';
import { getProducts } from '@/lib/DAO/productDAO';
import { getProductTypes } from '@/lib/DAO/productTypeDAO';
import { getUserByUid } from '@/lib/DAO/userDAO';
import { getVariants } from '@/lib/DAO/variantDAO';
import { getProductTypeWithCount } from '@/lib/firestore';
import { ModalFormProps } from '@/lib/types/manage';
import { formatPrice } from '@/lib/utils';
import Product from '@/models/product';
import { ModalBatch, ProductTypeWithCount } from '@/models/storageModels';
import User from '@/models/user';
import Variant from '@/models/variant';
import { withHashCacheAsync } from '@/utils/withHashCache';
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
import { onAuthStateChanged } from 'firebase/auth';
import { memo, useCallback, useEffect, useState } from 'react';
import CustomDateTimePicker from './CustomDateTimePicker';
import ProductTypeRenderOption from './ProductTypeRenderOption';
import ProductVariantRenderOption from './ProductVariantRenderOption';

interface BatchFormProps extends ModalFormProps {
  data: ModalBatch | null;
}

//#region Local Services

async function fetchProducts(productTypeId: string) {
  if (!productTypeId) {
    console.log('[Batch form] Cannot find selected product type');
    return [];
  }

  try {
    const products = await getProducts(productTypeId);
    return products;
  } catch (error) {
    console.log('[Batch form] Cannot re-fetch products', error);
    return [];
  }
}
async function fetchVariants(productTypeId: string, productId: string) {
  if (!productTypeId || !productId) {
    console.log('[Batch form] Cannot find selected product or product type');
    return [];
  }

  try {
    const variants = await getVariants(productTypeId, productId);

    return variants;
  } catch (error) {
    console.log('[Batch form] Cannot re-fetch variants', error);
    return [];
  }
}

const cacheFetchProducts = withHashCacheAsync(fetchProducts);
const cacheFetchVariants = withHashCacheAsync(fetchVariants);

//#endregion

export default memo(function BatchForm(props: BatchFormProps) {
  //#region Hooks

  // const snackbarAlert = useSnackbarService();

  //#endregion

  //#region States

  const [productTypes, setProductTypes] = useState<ProductTypeWithCount[]>([]);
  const [selectedProductType, setSelectedProductType] =
    useState<ProductTypeWithCount | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const [firstTime, setFirstTime] = useState(true);

  const [userData, setUserData] = useState<User | null>(null);
  const [userFetched, setUserFetched] = useState(false);

  //#endregion

  //#region Functions

  const calculateDiscountMoney = useCallback((): number => {
    if (!selectedVariant || !props.data) return 0;

    return (selectedVariant.price * props.data.discount.percent) / 100;
  }, [props.data, selectedVariant]);

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

  const checkShouldDisableDiscountDate = useCallback(
    (day: dayjs.Dayjs) => {
      const shouldDisabled =
        day.isBefore(props.data?.mfg) || day.isAfter(props.data?.exp);
      return shouldDisabled;
    },
    [props.data?.exp, props.data?.mfg]
  );

  //#endregion

  //#region UseEffects

  useEffect(() => {
    async function fetchInitial() {
      console.log('run');
      if (!firstTime) return;

      try {
        const productTypes = await getProductTypes();
        const productTypesWithCount = await Promise.all(
          productTypes.map(async (type) => await getProductTypeWithCount(type))
        );
        setProductTypes(productTypesWithCount);

        if (props.mode === 'create') return;

        const selectedProductType = productTypesWithCount.find(
          (type) => type.id === props.data?.product_type_id
        );

        if (!selectedProductType) {
          console.log('[Batch Form] Cannot find product type');
          return;
        }

        const products = await getProducts(selectedProductType?.id);
        const selectedProduct = products.find(
          (product) => product.id === props.data?.product_id
        );

        if (!selectedProduct) {
          console.log('[Batch Form] Cannot find product');
          return;
        }

        const variants = await getVariants(
          selectedProductType.id,
          selectedProduct.id
        );

        const selectedVariant = variants.find(
          (variant) => variant.id === props.data?.variant_id
        );

        if (!selectedVariant) {
          console.log('[Batch Form] Cannot find variant');
          return;
        }

        setProducts(products);
        setVariants(variants);

        setSelectedProductType(selectedProductType);
        setSelectedProduct(selectedProduct);
        setSelectedVariant(selectedVariant);

        setFirstTime(false);
      } catch (error) {
        console.log(error);
      }
    }

    fetchInitial();
  }, [firstTime, props.data?.product_id, props.data?.product_type_id, props.data?.variant_id, props.mode]);

  useEffect(() => {
    console.log('run');
    setDiscountAmount(() => calculateDiscountMoney());
  }, [calculateDiscountMoney, props.data?.discount.percent]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('run');

      if (!user) {
        setUserData(null);
        return;
      }

      if (userFetched) return;

      getUserByUid(user.uid)
        .then((user) => {
          if (user) {
            setUserFetched(true);

            getBranchByManager(user)
              .then((branch) =>
                handleFieldChange('branch_id', branch?.id ?? '')
              )
              .catch(() => handleFieldChange('branch_id', ''));
          }
        })
        .catch(() => setUserData(null));
    });

    return () => unsubscribe();
  }, [handleFieldChange, userFetched]);

  //#endregion

  //#region Handlers

  const handleProductTypeChange = useCallback(
    (value: ProductTypeWithCount | null) => {
      setSelectedProductType(value);
      setSelectedProduct(null);
      setSelectedVariant(null);

      async function fetchProductsOnChanges(value: ProductTypeWithCount) {
        if (!value) return;

        try {
          const products = await cacheFetchProducts(value.id);

          setProducts(products);
        } catch (error) {
          console.log('[Batch form] Cannot re-fetch products');
          setProducts([]);
        }
      }

      value && fetchProductsOnChanges(value);
      handleFieldChange('product_type_id', value?.id ?? '');
    },
    [handleFieldChange]
  );

  const handleSelectedProductChange = useCallback(
    (value: Product | null) => {
      setSelectedProduct(value);
      setSelectedVariant(null);

      async function fetchVariantsOnChanges(value: Product) {
        if (!value) return;

        try {
          const variants = await cacheFetchVariants(
            value.product_type_id,
            value.id
          );
          setVariants(variants);
        } catch (error) {
          console.log('[Batch form] Cannot re-fetch variants', error);
          setVariants([]);
        }
      }

      value && fetchVariantsOnChanges(value);
      handleFieldChange('product_id', value?.id ?? '');
    },
    [handleFieldChange]
  );

  const handleSelectedProductVariantChange = useCallback(
    (value: Variant | null) => {
      if (value) {
        setSelectedVariant(value);
        handleFieldChange('variant_id', value.id);
        console.log(value);
      }
    },
    [handleFieldChange]
  );

  //#endregion

  console.log('re-render');

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
              disabled={props.disabled || !selectedProductType}
            />

            <Autocomplete
              title="Biến thể"
              placeholder="Chọn biến thể"
              options={variants}
              value={selectedVariant}
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
              disabled={props.disabled || !selectedProduct}
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
              value={props.data?.quantity.toString()}
              type="number"
              onChange={(e) =>
                handleFieldChange('quantity', parseInt(e.target.value) || 0)
              }
              disabled={props.disabled}
              InputProps={{
                readOnly: props.readOnly,
              }}
            />

            <CustomDateTimePicker
              label="Sản xuất lúc"
              value={dayjs(props.data?.mfg)}
              onChange={(value) => {
                if (value) handleFieldChange('mfg', value.toDate());
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
              value={dayjs(props.data?.exp)}
              shouldDisableDate={(day) => day.isBefore(props.data?.mfg)}
              onChange={(value) => {
                if (value) handleFieldChange('exp', value.toDate());
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
              value={dayjs(props.data?.discount.start_at)}
              shouldDisableDate={checkShouldDisableDiscountDate}
              onChange={(value) => {
                if (props.data && value)
                  handleFieldChange('discount', {
                    ...props.data.discount,
                    start_at: value.toDate(),
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
