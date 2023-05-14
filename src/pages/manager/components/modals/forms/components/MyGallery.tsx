import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { StaticImageData } from 'next/image';
import { useState, useEffect } from 'react';
import MyGalleryImage from './MyGalleryImage';
import MyGalleryImageNewButton from './MyGalleryImageNewButton';

export default function MyGallery({
  title: title,
  srcs: paramSrcs,
  onChange,
  placeholderImage,
}: {
  title?: string;
  srcs: string[] | null;
  onChange: (values: string[]) => void;
  placeholderImage: StaticImageData;
}) {
  //#region States

  const [srcs, setSrcs] = useState<string[] | null>(paramSrcs);

  //#endregion

  //#region UseEffects

  useEffect(() => {
    if (!srcs) return;

    onChange(srcs);
  }, [srcs]);

  //#endregion

  const handleDeleteValue = (value: string) => {
    if (!srcs) return;
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
          {srcs?.length || 0}
        </Typography>
      </Typography>
      <Stack direction={'row'} flexWrap={'wrap'} gap={1}>
        {srcs?.map((src) => (
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
