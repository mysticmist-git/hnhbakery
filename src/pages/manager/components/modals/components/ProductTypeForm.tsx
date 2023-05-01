import { useState, useRef, RefObject } from 'react';
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
} from '@mui/material';
import { Delete, Close } from '@mui/icons-material';
import Image, { StaticImageData } from 'next/image';
import { DocumentData } from 'firebase/firestore';
import { Props as FormProps } from './lib';

const ProductTypeForm: React.FC<FormProps> = ({
  placeholderImage,
  theme,
  displayingData,
  setDisplayingData,
  featuredImageFile,
  setFeaturedImageFile,
  featuredImageURL,
  setFeaturedImageURL,
  uploadInputRef,
  handleUploadImage,
  handleDeleteRow,
  handleModalClose,
}) => {
  return (
    <Grid container>
      <Grid
        item
        lg={6}
        sx={{
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <Image
          src={
            featuredImageURL && featuredImageFile !== ''
              ? featuredImageURL
              : placeholderImage
          }
          alt="Featuring Image"
          width={240}
          height={240}
          priority
        />

        <Button
          variant="contained"
          sx={{
            borderRadius: '0 0 0.4rem 0.4rem',
            backgroundColor: theme.palette.secondary.main,
            '&:hover': {
              backgroundColor: theme.palette.secondary.dark,
            },
            textTransform: 'none',
            width: '100%',
          }}
          onClick={() => {
            if (uploadInputRef.current) (uploadInputRef.current as any).click();
          }}
        >
          Tải ảnh lên
          <input
            ref={uploadInputRef}
            type="file"
            onChange={handleUploadImage}
            style={{
              display: 'none',
            }}
          />
        </Button>
      </Grid>
      <Grid item lg={6}>
        <Box
          sx={{
            display: 'flex',
            gap: '1rem',
            flexDirection: 'column',
          }}
        >
          <TextField
            label="Tên loại sản phẩm"
            variant="standard"
            color="secondary"
            fullWidth
            value={displayingData?.name}
            onChange={(e) =>
              setDisplayingData({ ...displayingData, name: e.target.value })
            }
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
        </Box>
      </Grid>
    </Grid>
  );
};

export default ProductTypeForm;
