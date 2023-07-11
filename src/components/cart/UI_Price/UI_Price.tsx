import { formatPrice } from '@/lib/utils';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';

export default function UI_Price(props: any) {
  const theme = useTheme();
  const { row } = props;
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

  const hasDiscount = useMemo(() => {
    return row.discountPrice && row.discountPrice > 0;
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
        {formatPrice(row.price) + (isMd ? '' : ' /sản phẩm')}
      </Typography>
      {hasDiscount && (
        <Typography variant={'button'} color={theme.palette.common.black}>
          {formatPrice(row.discountPrice) + (isMd ? '' : ' /sản phẩm')}
        </Typography>
      )}
    </>
  );
}
