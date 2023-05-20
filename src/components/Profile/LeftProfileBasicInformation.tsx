import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import BasicInfoContentTypography from './BasicInfoContentTypography';
import BasicInfoHeadingTypography from './BasicInfoHeadingTypography';
import { LeftProfileBasicInfoProps, LeftProfileColumnProps } from './types';
import theme from '@/styles/themes/lightTheme';

const LeftProfileBasicInformation = ({
  avatarSrc,
  name,
  phone,
  email,
  address,
}: LeftProfileBasicInfoProps) => {
  return (
    <Stack
      alignContent={'start'}
      rowGap={2}
      sx={{
        width: '100%',
      }}
    >
      <Typography
        color={theme.palette.common.black}
        variant="h3"
        alignSelf={'center'}
      >
        Thông tin cơ bản
      </Typography>
      <Stack rowGap={1}>
        <BasicInfoHeadingTypography>
          Họ và tên:
          <BasicInfoContentTypography>{name}</BasicInfoContentTypography>
        </BasicInfoHeadingTypography>
        <BasicInfoHeadingTypography>
          Số điện thoại:{' '}
          <BasicInfoContentTypography>{phone}</BasicInfoContentTypography>
        </BasicInfoHeadingTypography>
        <BasicInfoHeadingTypography>
          Email:{' '}
          <BasicInfoContentTypography>{email}</BasicInfoContentTypography>
        </BasicInfoHeadingTypography>
        <BasicInfoHeadingTypography>
          Địa chỉ:{' '}
          <BasicInfoContentTypography>{address}</BasicInfoContentTypography>
        </BasicInfoHeadingTypography>
      </Stack>
    </Stack>
  );
};

export default LeftProfileBasicInformation;
