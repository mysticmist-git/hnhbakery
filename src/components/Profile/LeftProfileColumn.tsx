import { Card, Divider, Stack, Typography, useTheme } from '@mui/material';
import React, { memo } from 'react';
import Image from 'next/image';
import { LeftProfileColumnProps } from './types';
import LeftProfileBasicInformation from './LeftProfileBasicInformation';

const LeftProfileColumn = (props: LeftProfileColumnProps) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: 600,
      }}
    >
      <Stack alignItems={'center'} padding={4} rowGap={2}>
        <Image
          src={props.LeftProfileBasicInfo.avatarSrc}
          width={300}
          height={300}
          style={{
            borderColor: theme.palette.common.black,
            borderWidth: '2px',
            borderStyle: 'solid',
            borderRadius: '1rem',
            maxWidth: '100%', // Ensure image doesn't exceed container width
          }}
          alt="user-photoURL"
        />

        <Divider
          sx={{
            color: (theme) => theme.palette.common.black,
            width: '100%',
          }}
        />

        {/* Basic Information */}
        <LeftProfileBasicInformation {...props.LeftProfileBasicInfo} />
        <Divider
          sx={{
            color: (theme) => theme.palette.common.black,
            width: '100%',
          }}
        />
      </Stack>
    </Card>
  );
};

export default memo(LeftProfileColumn);
