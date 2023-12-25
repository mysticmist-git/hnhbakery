import defaultAva from '@/assets/defaultAva.jpg';
import { CustomIconButton } from '@/components/buttons';
import Outlined_TextField from '@/components/order/MyModal/Outlined_TextField';
import { useSnackbarService } from '@/lib/contexts';
// import { SuperDetail_UserObject } from '@/lib/models';
import { formatDateString, formatPrice } from '@/lib/utils';
import { UserTableRow } from '@/models/user';
import { ContentCopyRounded } from '@mui/icons-material';
import { Box, Grid, InputAdornment, Tooltip, useTheme } from '@mui/material';
import Image from 'next/image';
import React from 'react';

export default function ThongTin_Content({
  textStyle,
  modalUser,
}: {
  textStyle: any;
  modalUser: UserTableRow | null;
}) {
  const theme = useTheme();
  const handleSnackbarAlert = useSnackbarService();

  const getAddresses = (addresses: string[] | undefined) => {
    if (!addresses) return 'Trống';
    var result = '';
    for (let i = 0; i < addresses.length; i++) {
      result += i + 1 + '. ' + addresses[i];
      if (i < addresses.length - 1) {
        result += '\n';
      }
    }
    return result;
  };

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        {/* <Grid item xs={12} md={4} lg={2} alignSelf={'stretch'}>
          <Box
            sx={{
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
              aspectRatio: '1/1',
              borderRadius: '50%',
              border: 3,
              borderColor: theme.palette.text.secondary,
            }}
          >
            <Box
              component={Image}
              src={modalUser?.image ?? defaultAva.src}
              alt=""
              fill
              sx={{
                width: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        </Grid> */}
        <Grid item xs={12} md={4} lg={6} alignSelf={'stretch'}>
          <Box
            component={'div'}
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
            }}
          >
            <Outlined_TextField
              textStyle={textStyle}
              label="Mã khách hàng"
              value={modalUser?.id ?? 'Trống'}
              InputProps={{
                readOnly: true,
                style: {
                  pointerEvents: 'auto',
                  borderRadius: '8px',
                },
                endAdornment: modalUser?.id && (
                  <InputAdornment position="end">
                    <CustomIconButton
                      edge="end"
                      onClick={() => {
                        navigator.clipboard.writeText(modalUser?.id ?? 'Trống');
                        handleSnackbarAlert(
                          'success',
                          'Đã sao chép mã khách hàng vào clipboard!'
                        );
                      }}
                    >
                      <Tooltip title="Sao chép mã khách hàng vào clipboard">
                        <ContentCopyRounded fontSize="small" />
                      </Tooltip>
                    </CustomIconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Outlined_TextField
              textStyle={textStyle}
              label="Tên khách hàng"
              value={modalUser?.name ?? 'Trống'}
            />
            <Outlined_TextField
              textStyle={textStyle}
              label="Ngày sinh"
              value={
                formatDateString(modalUser?.birth, 'DD/MM/YYYY') ?? 'Trống'
              }
            />
            <Outlined_TextField
              textStyle={textStyle}
              label="Email"
              value={modalUser?.mail ?? 'Trống'}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={4} lg={6} alignSelf={'stretch'}>
          <Box
            component={'div'}
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
            }}
          >
            <Outlined_TextField
              textStyle={textStyle}
              label="Số điện thoại"
              value={modalUser?.tel ?? 'Trống'}
            />

            <Outlined_TextField
              textStyle={textStyle}
              label="Bậc khách hàng"
              value={modalUser?.customerRank?.name ?? 'Trống'}
            />

            <Outlined_TextField
              textStyle={textStyle}
              label="Số tiền đã thanh toán"
              value={formatPrice(modalUser?.paidMoney) ?? 'Trống'}
            />

            <Outlined_TextField
              textStyle={textStyle}
              label="Trạng thái tài khoản"
              value={modalUser?.active ? 'Hoạt động' : 'Vô hiệu hóa'}
            />
          </Box>
        </Grid>
        {/* <Grid item xs={12} alignSelf={'stretch'}>
          <Outlined_TextField
            textStyle={textStyle}
            multiline
            label="Danh sách địa chỉ"
            value={getAddresses(modalUser?.addresses) ?? 'Trống'}
          />
        </Grid> */}
      </Grid>
    </>
  );
}
