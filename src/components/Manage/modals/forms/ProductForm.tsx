import { useState, useEffect, useContext, memo, useMemo } from 'react';
import {
  Grid,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Switch,
  Tab,
  Tabs,
  Autocomplete,
  Stack,
} from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { CollectionName } from '@/lib/models/utilities';
import placeholderImage from '@/assets/placeholder-image.png';
import TabPanel from './components/TabPanel';
import { a11yProps } from './lib';
import MyGallery from './components/MyGallery';
import { ManageContextType, ManageActionType } from '@/lib/localLib/manage';
import theme from '@/styles/themes/lightTheme';
import CustomTextFieldWithLabel from '@/components/Inputs/CustomTextFieldWithLabel';
import {
  MyMultiValueInput,
  MyMultiValueCheckerInput,
} from '@/components/Inputs';
import { getCollection } from '@/lib/firestore';
import {
  ReferenceServiceInterface,
  ReferenceServiceProxy,
  ReferencesService,
} from '@/lib/services/ReferenceService';
import { ManageContext } from '@/lib/contexts';

//#region Types

interface ProductTypeStateProps {
  id: string;
  name: string;
}

//#endregion

const ProductForm = ({
  imageURLs,
  handleUploadGalleryToBrowser,
  readOnly = false,
  handleDeleteImage,
}: {
  imageURLs: (string | null)[] | null;
  handleUploadGalleryToBrowser: any;
  readOnly: boolean;
  handleDeleteImage: any;
}) => {
  //#region States

  // Context state

  const [tabValue, setTabValue] = useState(0);
  const [productTypes, setProductTypes] = useState<ProductTypeStateProps[]>([]);
  const [selectedProductType, setSelectedProductType] =
    useState<ProductTypeStateProps | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);

  //#endregion

  //#region Hooks

  const { state, dispatch } = useContext<ManageContextType>(ManageContext);

  //#endregion

  //#region useEffects

  useEffect(() => {
    async function getProductTypes() {
      try {
        const collectionRef = collection(db, CollectionName.ProductTypes);
        const snapshot = await getDocs(collectionRef);
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            name: docData.name,
          };
        });

        return data;
      } catch (error) {
        console.log('Error fetching product types: ', error);
        return [];
      }
    }

    async function fetchData() {
      const productTypes: ProductTypeStateProps[] = await getProductTypes();
      setProductTypes(() => productTypes);

      if (state.crudModalMode === 'create') return;

      // Set current data selected product type

      const displayingData = state.displayingData;
      if (!displayingData) return;

      // set selected product type
      if (displayingData) {
        setSelectedProductType(
          () =>
            productTypes.find(
              (pt) => pt.id === displayingData.productType_id,
            ) ?? productTypes[0],
        );
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const colors = await referenceService.getColors();
        setColors(() => colors);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSizes = async () => {
      try {
        const sizes = await referenceService.getSizes();
        setSizes(() => sizes);
      } catch (error) {
        console.log(error);
      }
    };

    fetchColors();
    fetchSizes();
  }, []);

  //#endregion

  //#region Handlers

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(() => newValue);
  };

  //#endregion

  // #region useMemos

  const referenceService: ReferenceServiceInterface = useMemo(
    () => new ReferenceServiceProxy(new ReferencesService()),
    [],
  );

  // #endregion

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
              value={state.displayingData?.name}
              onChange={(e) =>
                dispatch({
                  type: ManageActionType.SET_DISPLAYING_DATA,
                  payload: { ...state.displayingData, name: e.target.value },
                })
              }
            />

            <Autocomplete
              disablePortal
              value={selectedProductType}
              readOnly={readOnly}
              onChange={(event, newValue) => {
                if (!newValue) return;

                setSelectedProductType(newValue);

                dispatch({
                  type: ManageActionType.SET_DISPLAYING_DATA,
                  payload: {
                    ...state.displayingData,
                    productType_id: newValue?.id,
                  },
                });
              }}
              options={productTypes}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <CustomTextFieldWithLabel {...params} label="Loại sản phẩm" />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
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
              value={state.displayingData?.description ?? ''}
              rows={5}
              onChange={(e) =>
                dispatch({
                  type: ManageActionType.SET_DISPLAYING_DATA,
                  payload: {
                    ...state.displayingData,
                    description: e.target.value,
                  },
                })
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
              value={state.displayingData?.howToUse ?? ''}
              rows={3}
              onChange={(e) =>
                dispatch({
                  type: ManageActionType.SET_DISPLAYING_DATA,
                  payload: {
                    ...state.displayingData,
                    howToUse: e.target.value,
                  },
                })
              }
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
              value={state.displayingData?.preservation ?? ''}
              rows={3}
              onChange={(e) =>
                dispatch({
                  type: ManageActionType.SET_DISPLAYING_DATA,
                  payload: {
                    ...state.displayingData,
                    preservation: e.target.value,
                  },
                })
              }
            />
            <FormControlLabel
              control={
                <Switch
                  color="secondary"
                  disabled={readOnly}
                  checked={state.displayingData?.isActive ?? false}
                  onChange={(e) =>
                    dispatch({
                      type: ManageActionType.SET_DISPLAYING_DATA,
                      payload: {
                        ...state.displayingData,
                        isActive: e.target.checked,
                      },
                    })
                  }
                />
              }
              label={
                <Typography
                  sx={{ color: theme.palette.success.main }}
                  variant="body1"
                  fontWeight="bold"
                >
                  Còn hoạt động
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
          srcs={imageURLs}
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
            values={state.displayingData?.ingredients || []}
            onChange={(values) => {
              dispatch({
                type: ManageActionType.SET_DISPLAYING_DATA,
                payload: {
                  ...state.displayingData,
                  ingredients: values,
                },
              });
            }}
          />
          <MyMultiValueInput
            readOnly={readOnly}
            label={'Vật liệu'}
            values={state.displayingData?.materials ?? []}
            onChange={(values) => {
              dispatch({
                type: ManageActionType.SET_DISPLAYING_DATA,
                payload: {
                  ...state.displayingData,
                  materials: values,
                },
              });
            }}
          />
          <MyMultiValueCheckerInput
            readOnly={readOnly}
            label={'Màu sắc'}
            values={state.displayingData?.colors ?? []}
            options={colors}
            onChange={(values) => {
              dispatch({
                type: ManageActionType.SET_DISPLAYING_DATA,
                payload: {
                  ...state.displayingData,
                  colors: values,
                },
              });
            }}
          />

          <MyMultiValueCheckerInput
            readOnly={readOnly}
            label={'Kích cỡ'}
            values={state.displayingData?.sizes ?? []}
            options={sizes}
            onChange={(values) => {
              dispatch({
                type: ManageActionType.SET_DISPLAYING_DATA,
                payload: {
                  ...state.displayingData,
                  sizes: values,
                },
              });
            }}
          />
          {/* <MyMultiValueInput
            readOnly={readOnly}
            label={'Màu sắc'}
            values={state.displayingData?.colors ?? []}
            onChange={(values) => {
              dispatch({
                type: ManageActionType.SET_DISPLAYING_DATA,
                payload: {
                  ...state.displayingData,
                  colors: values,
                },
              });
            }}
          />
          <MyMultiValueInput
            readOnly={readOnly}
            label={'Kích cỡ'}
            values={state.displayingData?.sizes ?? []}
            onChange={(values) => {
              dispatch({
                type: ManageActionType.SET_DISPLAYING_DATA,
                payload: {
                  ...state.displayingData,
                  sizes: values,
                },
              });
            }}
          /> */}
        </Stack>
      </TabPanel>
    </>
  );
};

export default memo(ProductForm);
