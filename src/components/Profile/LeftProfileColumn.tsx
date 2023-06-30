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
import React, { memo, useRef, useState } from 'react';
import Image from 'next/image';
import { LeftProfileColumnProps } from './types';
import LeftProfileBasicInformation from './LeftProfileBasicInformation';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { CustomIconButton } from '../Inputs/Buttons';
import defaultAva from '@/assets/defaultAva.jpg';

const LeftProfileColumn = (props: LeftProfileColumnProps) => {
  const theme = useTheme();

  const [avtHover, setAvtHover] = useState(false);

  const inputfileRef = useRef<HTMLInputElement>(null);

  const originalAvtSrc =
    props.LeftProfileBasicInfo.avatarSrc != ''
      ? props.LeftProfileBasicInfo.avatarSrc
      : defaultAva.src;

  const [avtSrc, setAvtSrc] = useState(originalAvtSrc);

  const handleOnChangeInputFile = () => {
    if (inputfileRef.current) {
      console.log(inputfileRef.current.files);

      const newImage = inputfileRef.current.files?.[0];
      if (newImage) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const imageData = e.target?.result;
          setAvtSrc(imageData as string);
        };

        reader.readAsDataURL(newImage);
      }
    }
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
          <Box
            sx={{
              width: '100%',
              aspectRatio: 1,
              overflow: 'hidden',
              borderRadius: '50%',
              position: 'relative',
              border: 3,
              borderColor: theme.palette.secondary.main,
            }}
            onMouseEnter={() => setAvtHover(true)}
            onMouseLeave={() => setAvtHover(false)}
          >
            <Box
              component={Image}
              src={avtSrc}
              fill
              sx={{
                objectFit: 'cover',
              }}
              alt="user-photoURL"
            />
            {avtHover && (
              <CustomIconButton
                sx={{
                  position: 'absolute',
                  top: '50%',
                  width: '100%',
                  aspectRatio: 1,
                  left: '50%',
                  transform: 'translate(-50%,-50%)',
                  backgroundColor: alpha(theme.palette.common.black, 0.5),
                  color: theme.palette.common.white,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.common.black, 0.5),
                  },
                }}
                onClick={() =>
                  inputfileRef.current && inputfileRef.current.click()
                }
              >
                <CameraAltIcon />
                <input
                  ref={inputfileRef}
                  accept="image/*"
                  type="file"
                  hidden
                  onChange={handleOnChangeInputFile}
                />
              </CustomIconButton>
            )}
          </Box>
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
