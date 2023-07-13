import { formatPrice } from '@/lib/utils';
import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';

export default function UI_TotalPrice({
  price = 0,
  discountAmount = 0,
}: {
  price?: number;
  discountAmount?: number;
}) {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

  const totalPrice = useMemo(() => {

    if (!price) return 0;

    if (discountAmount) return price - discountAmount;

    return price;
  }, [price, discountAmount]);

  return (
    <>
      {isMd ? (
        <Stack>
          <Typography
            variant="button"
            color={theme.palette.common.black}
            sx={{
              fontWeight: 'bold',
            }}
          >
            {formatPrice(totalPrice)}
          </Typography>
        </Stack>
      ) : (
        <></>
      )}
    </>
  );
}
