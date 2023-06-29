import { Grid, IconButton, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { memo } from 'react';
import BasicInfoContentTypography from './BasicInfoContentTypography';
import BasicInfoHeadingTypography from './BasicInfoHeadingTypography';
import { LeftProfileBasicInfoProps } from './types';
import theme from '@/styles/themes/lightTheme';
import { Edit } from '@mui/icons-material';
import { useSnackbarService } from '@/lib/contexts';

const LeftProfileBasicInformation = ({
  avatarSrc,
  name,
  phone,
  email,
  address,
}: LeftProfileBasicInfoProps) => {
  // #region Hooks

  const handleSnackbarAlert = useSnackbarService();

  // #endregion

  // #region

  const handleEdit = () => {
    handleSnackbarAlert('info', 'Chức năng này chưa được cài đặt. Xin lỗi!');
  };

  // #endregion

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Grid item xs={12}>
        <Typography
          variant="h3"
          color={theme.palette.common.black}
          align={'center'}
          sx={{
            pb: 2,
          }}
        >
          Phan Trường Huy
        </Typography>
      </Grid>
      {/* <Grid item xs={12}>
        <IconButton
          color="secondary"
          sx={{
            transition: 'transform 0.3s ease-in-out',
            ':hover': {
              transform: 'scale(1.3) rotate(5deg)',
            },
          }}
          onClick={handleEdit}
        >
          <Edit />
        </IconButton>
      </Grid> */}
      {/* <Stack rowGap={1}>
        <Stack direction={'row'} columnGap={1}>
          <BasicInfoHeadingTypography>Họ và tên:</BasicInfoHeadingTypography>
          <BasicInfoContentTypography>{name}</BasicInfoContentTypography>
        </Stack>
        <Stack direction={'row'} columnGap={1}>
          <BasicInfoHeadingTypography>
            Số điện thoại:
          </BasicInfoHeadingTypography>
          <BasicInfoContentTypography>{phone}</BasicInfoContentTypography>
        </Stack>
        <Stack direction={'row'} columnGap={1}>
          <BasicInfoHeadingTypography>Email:</BasicInfoHeadingTypography>
          <BasicInfoContentTypography>{email}</BasicInfoContentTypography>
        </Stack>
        <Stack direction={'row'} columnGap={1}>
          <BasicInfoHeadingTypography>Địa chỉ:</BasicInfoHeadingTypography>
          <BasicInfoContentTypography>{address}</BasicInfoContentTypography>
        </Stack>
      </Stack> */}
    </Grid>
  );
};

export default memo(LeftProfileBasicInformation);
