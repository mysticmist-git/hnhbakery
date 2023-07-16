import { CustomIconButton } from '@/components/buttons';
import { storage } from '@/firebase/config';
import { BaseObject } from '@/lib/models';
import { ModalProductTypeObject } from '@/lib/types/manage';
import { LeftProfileColumnProps } from '@/lib/types/profile';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import {
  Box,
  Card,
  Divider,
  Grid,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { data } from 'autoprefixer';
import { ref } from 'firebase/storage';
import { useDeprecatedAnimatedState } from 'framer-motion';
import Image from 'next/image';
import React, {
  ChangeEvent,
  ChangeEventHandler,
  memo,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useUploadFile } from 'react-firebase-hooks/storage';
import ProfileAvatar from '../Avatar/ProfileAvatar';

const LeftProfileColumn = ({
  image,
  userId,
  onUpdateUserData,
}: LeftProfileColumnProps) => {
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
      await onUpdateUserData('image', `/${result?.metadata.fullPath}`);
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
        <Box sx={{ p: { xs: 2, sm: 2, md: 2, lg: 4 }, width: '100%' }}>
          <ProfileAvatar
            image={image}
            onUpdateUserData={onUpdateUserData}
            onUploadImage={handleUploadImage}
          />
        </Box>
      </Grid>

      {/* Basic Information */}

      {/* <Grid item xs={12}>
        <LeftProfileBasicInformation {...props.LeftProfileBasicInfo} />
      </Grid> */}
    </Grid>
  );
};

export default memo(LeftProfileColumn);
