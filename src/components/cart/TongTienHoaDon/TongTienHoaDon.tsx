import { CartItem } from '@/@types/cart';
import { AssembledProduct } from '@/lib/contexts/productsContext';
import { formatPrice } from '@/lib/utils';
import { Box, Typography, useTheme } from '@mui/material';
import { default as React, useContext, useMemo } from 'react';

type TongTienHoaDonProps = {
  totalPrice: number;
};

function TongTienHoaDon({ totalPrice }: TongTienHoaDonProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        border: 3,
        borderColor: theme.palette.secondary.main,
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        bgcolor: theme.palette.common.white,
      }}
    >
      <Box
        sx={{
          alignSelf: 'stretch',
          p: 2,
          bgcolor: theme.palette.secondary.main,
        }}
      >
        <Typography
          align="left"
          variant="body1"
          color={theme.palette.common.white}
        >
          Tổng hóa đơn
        </Typography>
      </Box>
      <Box
        sx={{
          alignSelf: 'stretch',
          p: 2,
          pb: 1,

          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          align="left"
          variant="body1"
          color={theme.palette.text.secondary}
        >
          Giá tiền bạn trả:
        </Typography>
        <Typography
          align="right"
          variant="body1"
          color={theme.palette.common.black}
        >
          {formatPrice(totalPrice)}
        </Typography>
      </Box>
      <Box
        sx={{
          alignSelf: 'stretch',
          p: 2,
          pt: 0,
        }}
      >
        <Typography
          align="left"
          variant="body2"
          color={theme.palette.text.secondary}
        >
          Vận chuyển, thuế và giảm giá sẽ được tính khi thanh toán.
        </Typography>
      </Box>
    </Box>
  );
}

export default TongTienHoaDon;
