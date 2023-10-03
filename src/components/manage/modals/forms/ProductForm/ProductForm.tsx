import placeholderImage from '@/assets/placeholder-image.png';
import { MyMultiValueInput } from '@/components/inputs/MultiValue';
import { COLLECTION_NAME } from '@/lib/constants';
import { getCollectionWithQuery } from '@/lib/firestore';
import { statusTextResolver } from '@/lib/manage/manage';
import {
  PathWithUrl,
  ProductTypeObject,
  ProductVariant,
  ReferenceObject,
} from '@/lib/models';
import {
  FileWithUrl,
  ModalFormProps,
  ProductFormRef,
} from '@/lib/types/manage';
import { ModalProduct } from '@/models/storageModels';
import theme from '@/styles/themes/lightTheme';
import {
  Autocomplete,
  Box,
  Divider,
  FormControlLabel,
  Grid,
  Skeleton,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { where } from 'firebase/firestore';
import {
  ForwardedRef,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { a11yProps } from '../utils/a11yProps';
import MyGallery from './MyGallery';
import ProductTypeAutocomplete from './ProductTypeAutoComplete';
import TabPanel from './TabPanel';
import VariantManager from './VariantManager';

interface ProductFormProps extends ModalFormProps {
  data: ModalProduct;
}

function ProductForm(
  { data, disabled, mode, readOnly, onDataChange }: ProductFormProps,
  ref: ForwardedRef<ProductFormRef>
) {
  //#region States

  const [tabValue, setTabValue] = useState<number>(0);
  const [productTypes, setProductTypes] = useState<ProductTypeObject[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<FileWithUrl[]>([]);

  //#endregion

  //#region Handlers

  function handleChange(event: React.SyntheticEvent, newValue: number) {
    setTabValue(() => newValue);
  }

  function handleFieldChange(field: string, value: any) {
    const newData: ModalProduct = {
      ...data,
      [field]: value,
    };
    onDataChange(newData);
  }

  function handleProductTypeIdChange(value: ProductTypeObject) {
    const newData: ModalProduct = {
      ...data,
      product_type_id: value.id ?? '',
    };
    onDataChange(newData);
  }

  function handleUploadGalleryToBrowser(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];

    const url = URL.createObjectURL(file);

    handleFieldChange('imageUrls', [...(data.imageUrls ?? []), { url }]);
    setImageFiles((imageFiles) => [...imageFiles, { file, url }]);
  }

  function handleDeleteImage(url: string) {
    if (!url) return;

    const updatedImageUrls = [...data.imageUrls];

    updatedImageUrls.splice(
      data.imageUrls.findIndex((i) => i.url === url),
      1
    );

    handleFieldChange('imageUrls', updatedImageUrls);
    setImageFiles((imageFiles) => imageFiles.filter((i) => i.url !== url));
  }

  function handleColorsChange(
    event: React.MouseEvent<HTMLElement>,
    newColors: string[]
  ) {
    if (newColors.length) {
      handleFieldChange('colors', newColors);
    }
  }

  function handleVariantsChange(variants: ProductVariant[]) {
    handleFieldChange('variants', [...variants]);
  }

  //#endregion

  //#region useEffects

  useEffect(() => {
    async function fetchProductTypes() {
      let productTypes: ProductTypeObject[] = [];

      try {
        productTypes = await getCollectionWithQuery<ProductTypeObject>(
          COLLECTION_NAME.PRODUCT_TYPES
        );
      } catch (error: any) {
        console.log(error);
      }

      setProductTypes(() => productTypes);
    }

    async function fetchColors() {
      let colors: string[] = [];

      try {
        const colorsRef: ReferenceObject[] = await getCollectionWithQuery(
          COLLECTION_NAME.REFERENCES,
          where('name', '==', 'colors')
        );

        if (!colorsRef || !colorsRef.length)
          throw new Error('Colors not found');

        colors = colorsRef[0].values;

        setColors(() => colors);
      } catch (error: any) {
        console.log(error);
      }
    }

    fetchProductTypes();
    fetchColors();
  }, []);

  //#endregion

  //#region Refs

  useImperativeHandle(
    ref,
    () => {
      return {
        getProductTypeName() {
          return (
            productTypes.find((i) => i.id === data.product_type_id)?.name ??
            'Không tìm thấy'
          );
        },
        getImageFiles() {
          return imageFiles;
        },
      };
    },
    [data.product_type_id, imageFiles, productTypes]
  );

  //#endregion

  //#region useMemos

  const selectedProductType = useMemo(() => {
    const selected = productTypes.find(
      (type) => type.id === data.product_type_id
    );

    return selected ?? null;
  }, [data.product_type_id, productTypes]);

  //#endregion

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          aria-label="basic tabs example"
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab label="Thông tin cơ bản" {...a11yProps(0)} />
          <Tab label="Ảnh" {...a11yProps(1)} />
          <Tab label="Biến thể" {...a11yProps(2)} />
        </Tabs>
      </Box>

      {/* First tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container columnSpacing={2}>
          <Grid
            item
            xs={6}
            sx={{
              display: 'flex',
              gap: '1rem',
              flexDirection: 'column',
            }}
          >
            <TextField
              label="Tên sản phẩm"
              InputProps={{
                readOnly: readOnly,
                sx: { color: theme.palette.common.black },
              }}
              sx={{
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.secondary.main,
                  color: theme.palette.common.black,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 2,
                  borderRadius: '8px',
                },
              }}
              variant="standard"
              color="secondary"
              fullWidth
              value={data.name}
              onChange={(event) =>
                handleFieldChange('name', event.target.value)
              }
            />

            {productTypes ? (
              <ProductTypeAutocomplete
                readOnly={readOnly}
                productTypes={productTypes}
                selectedProductType={selectedProductType}
                handleProductTypeChange={handleProductTypeIdChange}
              />
            ) : (
              <Skeleton variant="rectangular" animation="wave">
                <Autocomplete
                  renderInput={(params) => <TextField {...params} />}
                  options={[]}
                />
              </Skeleton>
            )}

            <TextField
              label="Miêu tả"
              InputProps={{
                readOnly: readOnly,
                sx: { color: theme.palette.common.black },
              }}
              sx={{
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.secondary.main,
                  color: theme.palette.common.black,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 2,
                  borderRadius: '8px',
                },
              }}
              color="secondary"
              multiline
              fullWidth
              value={data.description}
              rows={5}
              onChange={(e) => handleFieldChange('description', e.target.value)}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: 'flex',
              gap: '1rem',
              flexDirection: 'column',
            }}
          >
            <TextField
              label="Cách sử dụng"
              color="secondary"
              InputProps={{
                readOnly: readOnly,
                sx: { color: theme.palette.common.black },
              }}
              sx={{
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.secondary.main,
                  color: theme.palette.common.black,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 2,
                  borderRadius: '8px',
                },
              }}
              multiline
              fullWidth
              value={data.how_to_use}
              rows={3}
              onChange={(e) => handleFieldChange('howToUse', e.target.value)}
            />
            <TextField
              label="Cách bảo quản"
              color="secondary"
              InputProps={{
                readOnly: readOnly,
                sx: { color: theme.palette.common.black },
              }}
              sx={{
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.secondary.main,
                  color: theme.palette.common.black,
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 2,
                  borderRadius: '8px',
                },
              }}
              multiline
              fullWidth
              value={data.preservation}
              rows={3}
              onChange={(e) =>
                handleFieldChange('preservation', e.target.value)
              }
            />
            <FormControlLabel
              control={
                <Switch
                  color="secondary"
                  disabled={readOnly}
                  checked={data.active}
                  onChange={(e, checked) =>
                    handleFieldChange('active', checked)
                  }
                />
              }
              label={
                <Typography
                  sx={{
                    color: data.active
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                  }}
                  variant="body1"
                  fontWeight="bold"
                >
                  {statusTextResolver(data.active)}
                </Typography>
              }
              labelPlacement="start"
              sx={{
                alignSelf: 'end',
              }}
            />
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <MyGallery
          readOnly={readOnly}
          srcs={data.imageUrls}
          srcsConverter={(srcs: PathWithUrl[]) => srcs.map((src) => src.url)}
          onChange={() => console.log('This is my gallery on change callback')}
          placeholderImage={placeholderImage}
          handleUploadGalleryToBrowser={handleUploadGalleryToBrowser}
          handleDeleteImage={handleDeleteImage}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <Stack gap={1}>
          <MyMultiValueInput
            readOnly={readOnly}
            label={'Nguyên liệu'}
            values={data.ingredients}
            onChange={(values) => handleFieldChange('ingredients', values)}
          />

          <FormControlLabel
            label="Màu sắc"
            labelPlacement="top"
            control={
              <ToggleButtonGroup
                value={data.colors}
                onChange={handleColorsChange}
              >
                {colors.map((color) => (
                  <ToggleButton key={color} value={color}>
                    {color}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            }
            sx={{
              alignSelf: 'start',
              alignItems: 'start',
              margin: 0,
            }}
          />
          {/* <MyMultiValueCheckerInput
              readOnly={readOnly}
              label={'Màu sắc'}
              values={data.colors}
              options={colors}
              onChange={(values) => handleFieldChange('colors', values)}
            /> */}

          <Divider
            sx={{
              my: 1,
            }}
          />

          <VariantManager
            variants={data.variants}
            onChange={handleVariantsChange}
            readOnly={readOnly}
            disabled={disabled}
          />
        </Stack>
      </TabPanel>
    </>
  );
}

export default memo(forwardRef(ProductForm));
