import { storage } from '@/firebase/config';
import { LeftProfileColumnProps } from '@/lib/types/profile';
import { Box, Grid, useTheme } from '@mui/material';
import { ref } from 'firebase/storage';
import React, { ChangeEvent, ChangeEventHandler, memo, useMemo } from 'react';
import { useUploadFile } from 'react-firebase-hooks/storage';
import ProfileAvatar from '../ProfileAvatar';
import User from '@/models/user';

const LeftProfileColumn = ({
  image,
  userId,
  onUpdateUserData,
  customerRandImage,
}: {
  image: string;
  userId: string;
  onUpdateUserData?: (field: keyof User, value: User[keyof User]) => void;
  customerRandImage?: string;
}) => {
  const theme = useTheme();

  const [uploadFile, uploading, snapshot, error] = useUploadFile();
  const avtRef = useMemo(() => ref(storage, `/avatar/${userId}`), [userId]);

  const handleUploadImage: ChangeEventHandler<HTMLInputElement> = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    // Check
    if (!file) return;

    const result = await uploadFile(avtRef, file);

    if (onUpdateUserData)
      await onUpdateUserData('avatar', `/${result?.metadata.fullPath}`);
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Grid item xs={12}>
        <Box
          component={'div'}
          sx={{
            overflow: 'visible',
          }}
        >
          <ProfileAvatar
            image={image}
            onUpdateUserData={onUpdateUserData}
            onUploadImage={handleUploadImage}
            customerRandImage={customerRandImage}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default memo(LeftProfileColumn);
