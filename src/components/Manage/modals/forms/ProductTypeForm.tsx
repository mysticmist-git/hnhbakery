import placeholderImage from '@/assets/placeholder-image.png';
import {
  ModalFormProps,
  ModalProductTypeObject,
  ProductTypeFormRef,
} from '@/lib/localLib/manage';
import BaseObject from '@/lib/models/BaseObject';
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid,
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
  memo,
  useImperativeHandle,
  useState,
} from 'react';
import RowModalLayoutButton from '../rowModals/RowModalLayoutButton';

interface ProductTypeFormProps extends ModalFormProps {
  data: ModalProductTypeObject | null;
}

export default memo(
  forwardRef(function ProductTypeForm(
    {
      data,
      mode = 'none',
      readOnly = false,
      onDataChange,
      disabled = false,
    }: ProductTypeFormProps,
    ref: ForwardedRef<ProductTypeFormRef>
  ) {
    if (!data) return <div>Loading...</div>;
    if (mode === 'none') return <div>No mode specified</div>;

    //#region States

    const [imageFile, setImageFile] = useState<File | null>(null);

    //#endregion

    //#region Handlers

    const handleNameChange: ChangeEventHandler<HTMLInputElement> = (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const newData: ModalProductTypeObject = {
        ...data,
        name: event.target.value,
      };
      onDataChange(newData as BaseObject);
    };

    const handleDescriptionChange: ChangeEventHandler<HTMLInputElement> = (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const newData: ModalProductTypeObject = {
        ...data,
        description: event.target.value,
      };
      onDataChange(newData as BaseObject);
    };

    const handleIsActiveChange: ChangeEventHandler<HTMLInputElement> = (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const newData: ModalProductTypeObject = {
        ...data,
        isActive: event.target.checked,
      };
      onDataChange(newData as BaseObject);
    };

    const handleUploadImage: ChangeEventHandler<HTMLInputElement> = (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const file = event.target.files?.[0];

      // Check
      if (!file) return;

      setImageFile(() => file);

      const newData: ModalProductTypeObject = {
        ...data,
        imageURL: URL.createObjectURL(file),
      };
      onDataChange(newData as BaseObject);
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
              error={data.name === ''}
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
                  checked={data.isActive}
                  onChange={handleIsActiveChange}
                />
              }
              label={
                <Typography
                  sx={{
                    color: (theme) =>
                      data.isActive
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                  }}
                  variant="body1"
                  fontWeight="bold"
                >
                  {data.isActive ? 'Còn hoạt động' : 'Ngưng hoạt động'}
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
                }}
              />
            </Box>

            {['update', 'create'].includes(mode) && (
              <RowModalLayoutButton
                disabled={disabled}
                variant="contained"
                color="secondary"
              >
                Tải ảnh lên
                <input
                  hidden
                  accept="image/*"
                  multiple
                  type="file"
                  onChange={handleUploadImage}
                />
              </RowModalLayoutButton>
            )}
          </Stack>
        </Grid>
      </Grid>
    );
  })
);
