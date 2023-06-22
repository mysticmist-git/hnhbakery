import placeholderImage from '@/assets/placeholder-image.png';
import {
  MyMultiValueCheckerInput,
  MyMultiValueInput,
} from '@/components/Inputs';
import CustomTextFieldWithLabel from '@/components/Inputs/CustomTextFieldWithLabel';
import { COLLECTION_NAME } from '@/lib/constants';
import {
  PathWithUrl,
  getCollectionWithQuery,
} from '@/lib/firestore/firestoreLib';
import {
  ModalFormProps,
  ModalProductObject,
  ProductFormRef,
  statusTextResolver,
} from '@/lib/localLib/manage';
import { ProductTypeObject } from '@/lib/models';
import { ReferenceObject } from '@/lib/models/Reference';
import theme from '@/styles/themes/lightTheme';
import {
  Autocomplete,
  Box,
  Divider,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  colors,
  imageListItemBarClasses,
} from '@mui/material';
import { where } from 'firebase/firestore';
import {
  ForwardedRef,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import MyGallery from './components/MyGallery';
import TabPanel from './components/TabPanel';
import { a11yProps } from './lib';

interface ProductTypeStateProps {
  id: string;
  name: string;
}

interface ProductFormProps extends ModalFormProps {
  data: ModalProductObject;
}

export default memo(
  forwardRef(function ProductForm(
    { data, disabled, mode, readOnly, onDataChange }: ProductFormProps,
    ref: ForwardedRef<ProductFormRef>
  ) {
    //#region States

    const [tabValue, setTabValue] = useState<number>(0);
    const [productTypes, setProductTypes] = useState<ProductTypeObject[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    //#endregion

    //#region Handlers

    function handleChange(event: React.SyntheticEvent, newValue: number) {
      setTabValue(() => newValue);
    }

    function handleFieldChange(field: string, value: any) {
      const newData: ModalProductObject = {
        ...data,
        [field]: value,
      };
      onDataChange(newData);
    }

    function handleProductTypeIdChange(id: string) {
      if (!id) {
        console.log('Null product type id');
        return;
      }

      const newData: ModalProductObject = {
        ...data,
        productType_id: id,
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
      setImageFiles((imageFiles) => [...imageFiles, file]);
    }

    function handleDeleteImage(url: string) {
      if (!url) return;

      const updatedImageUrls = data.imageUrls.toSpliced(
        data.imageUrls.findIndex((i) => i.url === url),
        1
      );

      handleFieldChange('imageUrls', updatedImageUrls);
      setImageFiles((imageFiles) =>
        imageFiles.filter((i) => URL.createObjectURL(i) !== url)
      );
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
          console.log(productTypes);
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

          console.log(colorsRef);
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
          getImageFiles() {
            return imageFiles;
          },
        };
      },
      [imageFiles]
    );

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

              <Autocomplete
                disablePortal
                value={data.productType_id}
                readOnly={readOnly}
                onChange={(e, value) =>
                  handleProductTypeIdChange(value as string)
                }
                options={productTypes.map((p) => p.id)}
                getOptionLabel={(option) =>
                  productTypes.find((p) => p.id === option)?.name ??
                  'Không tìm thấy'
                }
                renderInput={(params) => (
                  <CustomTextFieldWithLabel {...params} label="Loại sản phẩm" />
                )}
              />

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
                onChange={(e) =>
                  handleFieldChange('description', e.target.value)
                }
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
                value={data.howToUse}
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
                    checked={data.isActive}
                    onChange={(e, checked) =>
                      handleFieldChange('isActive', checked)
                    }
                  />
                }
                label={
                  <Typography
                    sx={{
                      color: data.isActive
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                    }}
                    variant="body1"
                    fontWeight="bold"
                  >
                    {statusTextResolver(data.isActive)}
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
            onChange={() =>
              console.log('This is my gallery on change callback')
            }
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

            <MyMultiValueCheckerInput
              readOnly={readOnly}
              label={'Màu sắc'}
              values={data.colors}
              options={colors}
              onChange={(values) => handleFieldChange('colors', values)}
            />

            <Divider
              sx={{
                my: 1,
              }}
            />
          </Stack>
        </TabPanel>
      </>
    );
  })
);
