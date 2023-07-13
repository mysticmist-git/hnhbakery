import { formatPrice } from '@/lib/utils';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';

export default function UI_Price({
  price = 0,
  discountAmount = 0,
}: {
  price?: number;
  discountAmount?: number;
}) {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

  const hasDiscount = useMemo(() => {
    return Boolean(discountAmount) && discountAmount > 0;
  }, []);

  return (
    <>
      <Typography
        variant={'button'}
        color={theme.palette.common.black}
        sx={{
          fontWeight: hasDiscount ? 'none' : 'bold',
          textDecoration: hasDiscount ? 'line-through' : 'none',
          opacity: hasDiscount ? 0.5 : 1,
        }}
      >
        {formatPrice(price) + (isMd ? '' : ' /sản phẩm')}
      </Typography>
      {hasDiscount && (
        <Typography variant={'button'} color={theme.palette.common.black}>
          {formatPrice(price - discountAmount) + (isMd ? '' : ' /sản phẩm')}
        </Typography>
      )}
    </>
  );
}
