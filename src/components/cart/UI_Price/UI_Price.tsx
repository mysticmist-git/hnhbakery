import { formatPrice } from '@/lib/utils';
import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';

export default function UI_Price({
  price = 0,
  discounted,
  discountAmount = 0,
}: {
  price?: number;
  discounted: boolean;
  discountAmount?: number;
}) {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Stack gap={1} direction="row" justifyContent={'center'}>
      <Typography
        variant={'button'}
        color={theme.palette.common.black}
        sx={{
          fontWeight: discounted ? 'none' : 'bold',
          textDecoration: discounted ? 'line-through' : 'none',
          opacity: discounted ? 0.5 : 1,
        }}
      >
        {formatPrice(price) + (isMd ? '' : ' /sản phẩm')}
      </Typography>
      {discounted && (
        <Typography variant={'button'} color={theme.palette.common.black}>
          {formatPrice(price - discountAmount) + (isMd ? '' : ' /sản phẩm')}
        </Typography>
      )}
    </Stack>
  );
}
