import { useState, useRef, RefObject, useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  Divider,
  IconButton,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Theme,
  Tab,
  Tabs,
  Autocomplete,
  Stack,
  Chip,
  useTheme,
  styled,
  ButtonBase,
  Input,
  ImageList,
  ImageListItem,
  SxProps,
} from '@mui/material';
import { Delete, Close, Add } from '@mui/icons-material';
import Image, { StaticImageData } from 'next/image';
import {
  DocumentData,
  Firestore,
  collection,
  getDocs,
} from 'firebase/firestore';
import { Props as FormProps } from './lib';
import { db } from '@/firebase/config';
import { CollectionName } from '@/lib/models/utilities';
import { ProductType } from '@/lib/models';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface ProductTypeStateProps {
  id: string;
  name: string;
}

const DEFAULT_PRODUCT_TYPE_STATE = {
  id: '',
  name: '',
};

const ProductForm: React.FC<FormProps> = ({
  placeholderImage,
  displayingData,
  setDisplayingData,
  galleryURLs,
}) => {
  const [value, setValue] = useState(0);
  const [productTypes, setProductTypes] = useState<ProductTypeStateProps[]>([]);
  const [selectedProductType, setSelectedProductType] =
    useState<ProductTypeStateProps>(DEFAULT_PRODUCT_TYPE_STATE);

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
      setProductTypes(productTypes);

      // set selected product type
      if (displayingData) {
        setSelectedProductType(
          productTypes.find((pt) => pt.id === displayingData.productType_id) ??
            productTypes[0],
        );
      }
    }

    fetchData();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  console.log(displayingData.images);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
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
      <TabPanel value={value} index={0}>
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
              variant="standard"
              color="secondary"
              fullWidth
              value={displayingData?.name}
              onChange={(e) =>
                setDisplayingData({ ...displayingData, name: e.target.value })
              }
            />

            <Autocomplete
              disablePortal
              value={selectedProductType}
              onChange={(event, newValue) => {
                if (!newValue) return;

                setSelectedProductType(newValue);

                setDisplayingData({
                  ...displayingData,
                  productType_id: newValue?.id,
                });
              }}
              options={productTypes}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Loại sản phẩm" />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />

            <TextField
              label="Miêu tả"
              color="secondary"
              multiline
              fullWidth
              value={displayingData?.description}
              rows={5}
              onChange={(e) =>
                setDisplayingData({
                  ...displayingData,
                  description: e.target.value,
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
              multiline
              fullWidth
              value={displayingData?.howToUse}
              rows={3}
              onChange={(e) =>
                setDisplayingData({
                  ...displayingData,
                  howToUse: e.target.value,
                })
              }
            />
            <TextField
              label="Cách bảo quản"
              color="secondary"
              multiline
              fullWidth
              value={displayingData?.preservation}
              rows={3}
              onChange={(e) =>
                setDisplayingData({
                  ...displayingData,
                  preservation: e.target.value,
                })
              }
            />
            <FormControlLabel
              control={
                <Switch
                  color="secondary"
                  checked={displayingData?.isActive}
                  onChange={(e) =>
                    setDisplayingData({
                      ...displayingData,
                      isActive: e.target.checked,
                    })
                  }
                />
              }
              label={
                <Typography variant="body1" fontWeight="bold">
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
      <TabPanel value={value} index={1}>
        <MyGallery
          srcs={galleryURLs}
          onChange={() => console.log('This is my gallery on change callback')}
          placeholderImage={placeholderImage}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Stack gap={1}>
          <MyMultiValueInput
            label={'Nguyên liệu'}
            values={displayingData?.ingredients}
            onChange={(values) => {
              setDisplayingData({
                ...displayingData,
                ingredients: values,
              });
            }}
          />
          <MyMultiValueInput
            label={'Vật liệu'}
            values={displayingData?.materials}
            onChange={(values) => {
              setDisplayingData({
                ...displayingData,
                materials: values,
              });
            }}
          />
          <MyMultiValueInput
            label={'Màu sắc'}
            values={displayingData?.colors}
            onChange={(values) => {
              setDisplayingData({
                ...displayingData,
                colors: values,
              });
            }}
          />
          <MyMultiValueInput
            label={'Kích cỡ'}
            values={displayingData?.sizes}
            onChange={(values) => {
              setDisplayingData({
                ...displayingData,
                sizes: values,
              });
            }}
          />
        </Stack>
      </TabPanel>
    </>
  );
};

function MyGalleryImage({
  src,
  srcs,
  setSrcs,
}: {
  src: any;
  srcs: string[];
  setSrcs: any;
}) {
  return (
    <Box
      position="relative"
      sx={{
        '&:hover > button': {
          visibility: 'visible',
          opacity: 1,
        },
      }}
    >
      <Image
        src={src}
        alt="Gallery Image"
        width={172}
        height={240}
        priority
        style={{ objectFit: 'cover', borderRadius: '1rem' }}
      />
      <IconButton
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 1,
          color: 'common.white',
          visibility: 'hidden',
          opacity: 0,
          transition: 'opacity 0.2s ease-in-out',
        }}
        onClick={() => setSrcs(srcs.filter((s) => s !== src))}
      >
        <Close />
      </IconButton>
    </Box>
  );
}

function MyGalleryImageNewButton({
  sx,
  srcs,
  setSrcs,
}: {
  sx?: SxProps;
  srcs: string[];
  setSrcs: any;
}) {
  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const files = event.target.files;
      // Add your file upload logic here
      const file = files[0];
      setSrcs([...srcs, URL.createObjectURL(file)]);
    };
    input.click();
  };

  return (
    <Box
      width={172}
      height={240}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'background-color 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        },
        '&:active': {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        },
        ...sx,
      }}
      onClick={handleFileUpload}
    >
      <Add
        sx={{
          width: '44px',
          height: '44px',
        }}
      />
    </Box>
  );
}

function MyGallery({
  title: title,
  srcs: paramSrcs,
  onChange,
  placeholderImage,
}: {
  title?: string;
  srcs: string[];
  onChange: (values: string[]) => void;
  placeholderImage: StaticImageData;
}) {
  const [srcs, setSrcs] = useState<string[]>(paramSrcs);

  useEffect(() => {
    onChange(srcs);
  }, [srcs]);

  const handleDeleteValue = (value: string) => {
    setSrcs(srcs.filter((v) => v !== value));
  };

  const handleAddNewValue = () => {
    // ...
  };

  return (
    <Stack spacing={1}>
      {title && (
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
      )}
      <Typography variant="h6" fontWeight="bold">
        {'Tổng số ảnh: '}
        <Typography variant="body1" display={'inline'}>
          {srcs.length}
        </Typography>
      </Typography>
      <Stack direction={'row'} flexWrap={'wrap'} gap={1}>
        {srcs.map((src) => (
          <MyGalleryImage
            src={src && src !== '' ? src : placeholderImage}
            srcs={srcs}
            setSrcs={setSrcs}
          />
        ))}
        <MyGalleryImageNewButton
          sx={{
            backgroundColor: '#ccc',
            borderRadius: '1rem',
            '&:hover': {
              backgroundColor: '#bbb',
            },
            color: 'common.white',
          }}
          srcs={srcs}
          setSrcs={setSrcs}
        />
      </Stack>
    </Stack>
  );
}

const NewValueChip = ({
  value,
  placeholder,
  width,
  onChange,
  onClick,
}: {
  value?: string;
  placeholder?: string;
  width?: string;
  onChange?: any;
  onClick?: any;
}) => {
  return (
    <Box
      sx={{
        backgroundColor: '#eee',
        borderRadius: '1rem',
        height: '32px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: '12px',
      }}
    >
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        sx={{
          border: 'none',
          backgroundColor: 'transparent',
          width: width ?? '52px',
        }}
        disableUnderline
      />
      <Divider sx={{ height: 28, my: 0.5, ml: 0.5 }} orientation="vertical" />
      <ButtonBase
        onClick={onClick}
        sx={{
          border: 'none',
          backgroundColor: '#ccc',
          color: 'common.white',
          paddingX: '4px',
          borderRadius: '0 1rem 1rem 0',
          marginY: '0',
          height: '100%',
          '&:hover': {
            backgroundColor: '#bbb',
          },
        }}
      >
        <Add />
      </ButtonBase>
    </Box>
  );
};

function MyMultiValueInput({
  label,
  values: paramValues,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const [values, setValues] = useState<string[]>(paramValues);
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    onChange(values);
  }, [values]);

  const handleDeleteValue = (value: string) => {
    setValues(values.filter((v) => v !== value));
  };

  const handleAddNewValue = () => {
    if (!newValue || newValue === '') return;

    setValues([...values, newValue]);
    setNewValue('');
  };

  return (
    <Stack spacing={1}>
      <Typography variant="body1" fontWeight="bold">
        {label}
      </Typography>
      <Stack direction={'row'} flexWrap={'wrap'} gap={1}>
        {values.map((value) => (
          <Chip
            key={value}
            label={value}
            onDelete={() => handleDeleteValue(value)}
          />
        ))}

        <NewValueChip
          value={newValue}
          placeholder="Thêm mới"
          width={'68px'}
          onChange={(e: any) => setNewValue(e.target.value)}
          onClick={handleAddNewValue}
        />
      </Stack>
    </Stack>
  );
}

export default ProductForm;
