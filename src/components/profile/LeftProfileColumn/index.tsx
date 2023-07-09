import { CustomIconButton } from '@/components/buttons';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { Box, Grid, alpha, useTheme } from '@mui/material';
import Image from 'next/image';
import React, { memo, useState } from 'react';

const LeftProfileColumn = (props: LeftProfileColumnProps) => {
  const theme = useTheme();

  const [avtHover, setAvtHover] = useState(false);

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
              src={props.LeftProfileBasicInfo.avatarSrc}
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
              >
                <CameraAltIcon />
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
