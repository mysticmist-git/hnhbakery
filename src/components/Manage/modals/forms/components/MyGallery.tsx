import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { StaticImageData } from 'next/image';
import { useState, useEffect, memo } from 'react';
import MyGalleryImage from './MyGalleryImage';
import MyGalleryImageNewButton from './MyGalleryImageNewButton';

const MyGallery = ({
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
}) => {
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
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
      )}
      <Typography variant="h6" fontWeight="bold">
        {'Tổng số ảnh: '}
        <Typography variant="body1" display={'inline'}>
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
};

export default memo(MyGallery);
