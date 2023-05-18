import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { StaticImageData } from 'next/image';
import { useState, useEffect } from 'react';
import MyGalleryImage from './MyGalleryImage';
import MyGalleryImageNewButton from './MyGalleryImageNewButton';
import theme from '@/styles/themes/lightTheme';

export default function MyGallery({
  title: title,
  srcs,
  placeholderImage,
  readOnly = false,
  handleUploadGalleryToBrowser,
  handleDeleteImage,
}: {
  title?: string;
  srcs: any[] | null;
  onChange: (values: (string | null)[]) => void;
  placeholderImage: StaticImageData;
  readOnly: boolean;
  handleUploadGalleryToBrowser: any;
  handleDeleteImage: any;
}) {
  //#region States

  //#endregion

  //#region UseEffects

  //#endregion

  //#region Methods

  //#endregion

  console.log(srcs);

  return (
    <Stack spacing={1}>
      {title && (
        <Typography
          sx={{ color: theme.palette.common.black }}
          variant="h6"
          fontWeight="bold"
        >
          {title}
        </Typography>
      )}
      <Typography
        sx={{ color: theme.palette.common.black }}
        variant="h6"
        fontWeight="bold"
      >
        {'Tổng số ảnh: '}
        <Typography
          sx={{ color: theme.palette.common.black }}
          variant="body1"
          display={'inline'}
        >
          {srcs?.length || 0}
        </Typography>
      </Typography>
      <Stack direction={'row'} flexWrap={'wrap'} gap={1}>
        {srcs?.map((src) => (
          <MyGalleryImage
            src={src && src !== '' ? src : placeholderImage}
            handleDeleteImage={handleDeleteImage}
            readOnly={readOnly}
          />
        ))}
        <MyGalleryImageNewButton
          disabled={readOnly}
          sx={{
            backgroundColor: '#ccc',
            borderRadius: '1rem',
            '&:hover': {
              backgroundColor: '#bbb',
            },
            color: 'common.white',
          }}
          handleUploadGalleryToBrowser={handleUploadGalleryToBrowser}
        />
      </Stack>
    </Stack>
  );
}
