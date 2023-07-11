import { formatPrice } from '@/lib/utils';
import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';

export default function UI_TotalPrice(props: any) {
  const theme = useTheme();
  const { row }: { row: DisplayCartItem } = props;
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

  const finalTotalPrice = useMemo(() => {
    if (row.discountPrice && row.discountPrice > 0) {
      return row.quantity * row.discountPrice;
    }

    return row.quantity * row.price;
  }, [row.quantity]);

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
            {formatPrice(finalTotalPrice)}
          </Typography>
        </Stack>
      ) : (
        <></>
      )}
    </>
  );
}
