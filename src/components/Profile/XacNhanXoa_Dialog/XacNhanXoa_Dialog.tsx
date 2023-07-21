import CustomButton from '@/components/buttons/CustomButton/CustomButton';
import { CustomDialog } from '@/components/dialogs';
import { useSnackbarService } from '@/lib/contexts';
import { Grid, Typography, useTheme } from '@mui/material';
import React from 'react';

export default function XacNhanXoa_Dialog(props: any) {
  const theme = useTheme();
  const { handleClose, open, handleXacNhan } = props;

  return (
    <>
      <CustomDialog
        title="Xóa các địa chỉ đã chọn?"
        open={open}
        handleClose={handleClose}
        width={{ md: '30vw', xs: '65vw' }}
      >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={'auto'}>
            <CustomButton
              onClick={handleClose}
              sx={{ bgcolor: theme.palette.text.secondary }}
            >
              <Typography variant="button" color={theme.palette.common.white}>
                Hủy
              </Typography>
            </CustomButton>
          </Grid>
          <Grid item xs={'auto'}>
            <CustomButton onClick={() => handleXacNhan()}>
              <Typography variant="button" color={theme.palette.common.white}>
                Xác nhận
              </Typography>
            </CustomButton>
          </Grid>
        </Grid>
      </CustomDialog>
    </>
  );
}
