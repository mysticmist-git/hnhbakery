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
import { memo, useMemo, useState } from 'react';
import { useDownloadURL } from 'react-firebase-hooks/storage';

function RenderSaleItem(props: any) {
  const theme = useTheme();
  const { sale, chosenSale, handleChooseSale } = props;
  const { id, name, code, image, percent, maxSalePrice, end_at } =
    useMemo(() => {
      return sale;
    }, [sale]);

  const [isHover, setIsHover] = useState(false);

  // const [downloadURL, loading, error] = useDownloadURL(
  //   image && image !== '' ? ref(storage, image) : undefined
  // );

  const [downloadURL, loading, error] = useDownloadURL(
    ref(storage, '/sales/sale-img.jpg')
  );

  const style = {
    normal: {
      objectFit: 'cover',
      transition: 'all 0.3s ease-in-out',
    },
    hover: {
      objectFit: 'cover',
      transition: 'all 0.3s ease-in-out',
      transform: 'scale(1.5) rotate(5deg)',
    },
  };

  return (
    <>
      <Grid item xs={12}>
        <Grid
          container
          direction={'row'}
          justifyContent={'center'}
          alignItems={'start'}
          spacing={1}
          onMouseOver={() => setIsHover(true)}
          onMouseOut={() => setIsHover(false)}
        >
          <Grid item xs={5} alignSelf={'stretch'}>
            <Box
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
                  src={downloadURL ?? ''}
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
              spacing={0.5}
              direction={'row'}
              alignItems={'start'}
              justifyContent={'center'}
              sx={{
                py: 0.5,
              }}
            >
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 'bold',
                  }}
                  color={theme.palette.secondary.main}
                >
                  {name}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color={theme.palette.common.black}>
                  {'Mã code: ' + code}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color={theme.palette.common.black}>
                  {'Giảm: ' +
                    percent +
                    '%, tối đa ' +
                    formatPrice(maxSalePrice)}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color={theme.palette.common.black}>
                  {'Hạn sử dụng: ' + formatDateString(new Date(end_at))}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={'auto'} alignSelf={'center'}>
            <Checkbox
              sx={{ color: theme.palette.secondary.main }}
              color="secondary"
              checked={chosenSale && id === chosenSale.id}
              onChange={() => {
                handleChooseSale(sale);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default memo(RenderSaleItem);
