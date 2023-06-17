import placeholderImage from '@/assets/placeholder-image.png';
import {
  MyMultiValueCheckerInput,
  MyMultiValueInput,
} from '@/components/Inputs';
import CustomTextFieldWithLabel from '@/components/Inputs/CustomTextFieldWithLabel';
import { ModalFormProps, ModalProductObject } from '@/lib/localLib/manage';
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
} from '@mui/material';
import { memo } from 'react';
import MyGallery from './components/MyGallery';
import TabPanel from './components/TabPanel';
import { a11yProps } from './lib';

interface ProductTypeStateProps {
  id: string;
  name: string;
}

interface ProductFormProps extends ModalFormProps {
  data: ModalProductObject | null;
}

const ProductForm = ({ data }: ProductFormProps) => {
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
                  sx={{
                    color: state.displayingData?.isActive
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                  }}
                  variant="body1"
                  fontWeight="bold"
                >
                  {state.displayingData?.isActive
                    ? 'Còn hoạt động'
                    : 'Ngưng hoạt động'}
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

          <Divider
            sx={{
              my: 1,
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
        </Stack>
      </TabPanel>
    </>
  );
};

export default memo(ProductForm);
