import placeholderImage from '@/assets/placeholder-image.png';
import { RowModalLayoutButton } from '@/components/manage/modals/rowModals';
import { ModalFormProps, ProductTypeFormRef } from '@/lib/types/manage';
import { BaseModel, ModalProductType } from '@/models/storageModels';
import {
  Box,
  Divider,
  FormControlLabel,
  Grid,
  Skeleton,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import {
  ChangeEvent,
  ChangeEventHandler,
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';

interface ProductTypeFormProps extends ModalFormProps {
  data: ModalProductType | null;
}

const ProductTypeForm = (
  {
    data,
    mode = 'none',
    readOnly = false,
    onDataChange,
    disabled = false,
  }: ProductTypeFormProps,
  ref: ForwardedRef<ProductTypeFormRef>
) => {
  //#region States

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imgLoading, setImgLoading] = useState<boolean>(true);

  //#endregion

  //#region Handlers

  const handleNameChange: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    onDataChange({
      ...data,
      name: event.target.value,
    } as BaseModel);
  };

  const handleDescriptionChange: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    onDataChange({
      ...data,
      description: event.target.value,
    } as BaseModel);
  };

  const handleIsActiveChange: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    onDataChange({
      ...data,
      active: event.target.checked,
    } as BaseModel);
  };

  const handleUploadImage: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    // Check
    if (!file) return;

    setImageFile(() => file);

    onDataChange({
      ...data,
      imageURL: URL.createObjectURL(file),
    } as BaseModel);
  };

  //#endregion

  //#region Refs

  useImperativeHandle(
    ref,
    () => {
      return {
        getImageFile() {
          return imageFile;
        },
      };
    },
    [imageFile]
  );

  //#endregion

  if (!data) return <div>Loading...</div>;
  if (mode === 'none') return <div>No mode specified</div>;

  return (
    <Grid container columnSpacing={2}>
      <Grid item xs={5.5}>
        <Box
          sx={{
            display: 'flex',
            gap: '1rem',
            flexDirection: 'column',
          }}
        >
          <TextField
            disabled={disabled}
            label="Tên loại sản phẩm"
            placeholder="Tên loại sản phẩm"
            variant="standard"
            color="secondary"
            fullWidth
            value={data.name}
            InputProps={{
              readOnly: readOnly,
              sx: {
                color: (theme) => theme.palette.common.black,
              },
            }}
            sx={{
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: (theme) => theme.palette.secondary.main,
                color: (theme) => theme.palette.common.black,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                color: (theme) => theme.palette.common.black,
                border: 2,
                borderRadius: '8px',
              },
            }}
            onChange={handleNameChange}
          />
          <TextField
            disabled={disabled}
            label="Miêu tả"
            placeholder="Miêu tả sản phẩm"
            color="secondary"
            multiline
            fullWidth
            InputProps={{
              readOnly: readOnly,
              sx: { color: (theme) => theme.palette.common.black },
            }}
            sx={{
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: (theme) => theme.palette.secondary.main,
                color: (theme) => theme.palette.common.black,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 2,
                borderRadius: '8px',
              },
            }}
            value={data.description}
            rows={5}
            onChange={handleDescriptionChange}
          />
          <FormControlLabel
            control={
              <Switch
                disabled={readOnly || disabled}
                color="secondary"
                checked={data.active}
                onChange={handleIsActiveChange}
              />
            }
            label={
              <Typography
                sx={{
                  color: (theme) =>
                    data.active
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                }}
                variant="body1"
                fontWeight="bold"
              >
                {data.active ? 'Còn hoạt động' : 'Ngưng hoạt động'}
              </Typography>
            }
            labelPlacement="end"
            sx={{
              alignSelf: 'start',
            }}
          />
        </Box>
      </Grid>

      <Grid item xs={1}>
        <Divider orientation="vertical" />
      </Grid>

      <Grid item xs={5.5}>
        <Stack spacing={1}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: 240,
              border: (theme) => `2px solid ${theme.palette.common.gray}`,
              borderRadius: '1rem',
              overflow: 'hidden',
            }}
          >
            <Image
              src={
                data.imageURL && data.imageURL.length > 0
                  ? data.imageURL
                  : placeholderImage
              }
              alt="Featuring Image"
              priority
              fill
              style={{
                objectFit: 'cover',
                display: 'none',
              }}
              onLoadingComplete={(img) => {
                img.style.display = 'block';
                setImgLoading(() => false);
              }}
            />
            {imgLoading && (
              <Skeleton
                variant="rectangular"
                width={'100%'}
                height={240}
                animation="wave"
              />
            )}
          </Box>

          {['update', 'create'].includes(mode) && (
            <RowModalLayoutButton
              disabled={disabled}
              variant="contained"
              color="secondary"
              component="label"
            >
              Tải ảnh lên
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleUploadImage}
              />
            </RowModalLayoutButton>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default forwardRef(ProductTypeForm);
