import { storage } from '@/firebase/config';
import { formatDateString, formatPrice } from '@/lib/utils';
import {
  Box,
  Checkbox,
  Grid,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material';
import { ref } from 'firebase/storage';
import Image from 'next/image';
import { memo, useEffect, useMemo, useState } from 'react';
import { useDownloadURL } from 'react-firebase-hooks/storage';
import promotionImage from '@/assets/promotion.png';
import Sale from '@/models/sale';
function RenderSaleItem(props: {
  sale: Sale;
  chosenSale: Sale | null;
  handleChooseSale: (newChosenSale: Sale) => void;
  tamTinh: number;
}) {
  const theme = useTheme();
  const { sale, chosenSale, handleChooseSale, tamTinh } = props;
  const {
    id,
    name,
    code,
    description,
    percent,
    limit,
    image,
    start_at,
    end_at,
    created_at,
    updated_at,
  } = useMemo(() => {
    return sale;
  }, [sale]);

  const [isHover, setIsHover] = useState(false);

  const [canClick, setCanClick] = useState(false);

  const [downloadURL, loading, error] = useDownloadURL(
    ref(storage, '/sales/sale-img.jpg')
  );

  const style = {
    normal: {
      objectFit: 'contain',
      transition: 'all 0.3s ease-in-out',
    },
    hover: {
      objectFit: 'contain',
      transition: 'all 0.3s ease-in-out',
      transform: 'scale(1.5) rotate(5deg)',
    },
  };

  useEffect(() => {
    if (sale.minBillTotalPrice <= tamTinh) {
      setCanClick(true);
    } else {
      setCanClick(false);
    }
  }, [sale, tamTinh]);

  return (
    <>
      <Box
        component={'div'}
        sx={{
          borderTop: 1.5,
          borderColor: 'grey.100',
          py: 1.5,
          position: 'relative',
          opacity: canClick ? 1 : 0.6,
        }}
        onMouseOver={() => setIsHover(true && canClick)}
        onMouseOut={() => setIsHover(false)}
      >
        <Grid
          container
          direction={'row'}
          justifyContent={'center'}
          alignItems={'start'}
          spacing={1}
        >
          <Grid item xs={5} alignSelf={'stretch'}>
            <Box
              component={'div'}
              sx={{
                width: '100%',
                height: '100%',
                minHeight: '96px',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '8px',
              }}
            >
              {!loading && (
                <Box
                  component={Image}
                  src={downloadURL ?? promotionImage.src}
                  alt={name}
                  loading="lazy"
                  fill={true}
                  sx={isHover ? style.hover : style.normal}
                />
              )}
              {loading && (
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  width={'100%'}
                  height={'100%'}
                />
              )}
            </Box>
          </Grid>
          <Grid item xs={true}>
            <Grid
              container
              direction={'row'}
              alignItems={'start'}
              justifyContent={'center'}
              sx={{
                py: 0.5,
              }}
            >
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 'bold',
                    color: canClick ? 'secondary.main' : 'grey.500',
                  }}
                >
                  {name}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  color={theme.palette.common.black}
                  fontWeight={'regular'}
                >
                  {'Mã code: ' + code}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  color={theme.palette.common.black}
                  fontWeight={'regular'}
                >
                  {'Giảm: ' +
                    percent +
                    '%, tối đa ' +
                    formatPrice(limit, ' đồng')}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  color={theme.palette.common.black}
                  fontWeight={'regular'}
                >
                  {'Đơn hàng tối thiểu: ' +
                    formatPrice(sale.minBillTotalPrice, ' đồng')}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  color={theme.palette.common.black}
                  fontWeight={'regular'}
                >
                  {'Hạn sử dụng: ' + formatDateString(new Date(end_at))}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={'auto'} alignSelf={'center'}>
            <Checkbox
              sx={{ color: theme.palette.secondary.main }}
              color="secondary"
              checked={chosenSale ? sale.id === chosenSale.id : false}
              disabled={!canClick}
              onChange={() => {
                handleChooseSale(sale);
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default memo(RenderSaleItem);
