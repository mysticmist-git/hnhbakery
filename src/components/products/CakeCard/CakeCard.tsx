import { CustomIconButton } from '@/components/buttons';
import {
  getDownloadUrlFromFirebaseStorage,
} from '@/lib/firestore';
import { formatPrice } from '@/lib/utils';
import { BatchTableRow } from '@/models/batch';
import { ShoppingCart } from '@mui/icons-material';
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// type CakeCardProps = {
//   name: string;
//   description: string;
//   image: string;
//   href: string;
//   price: number;
//   discountPrice: number;
//   discounted: boolean;
//   imageHeight: string;
//   imageHeightList: string;
// };

//#endregion
function CakeCard({
  batch,
  imageHeight,
  imageHeightList,
  viewState,
}: {
  viewState: 'grid' | 'list';
  batch: BatchTableRow;
  imageHeight: string;
  imageHeightList: string;
}) {
  const [cardHover, setCardHover] = useState(false);
  const theme = useTheme();

  const imageStyles = {
    cardNormal: {
      width: '100%',
      height: '100%',
      transition: 'transform 0.3s ease-in-out',
      objectFit: 'cover',
      cursor: 'pointer',
    },
    cardHovered: {
      width: '100%',
      height: '100%',
      transition: 'transform 0.3s ease-in-out',
      transform: 'scale(1.3) rotate(5deg)',
      objectFit: 'cover',
      cursor: 'pointer',
    },
  };

  const [img, setImg] = useState('');

  useEffect(() => {
    getDownloadUrlFromFirebaseStorage(batch.product?.images[0] ?? '')
      .then((url) => {
        setImg(url);
      })
      .catch(() => setImg(''));
  }, [batch.product?.images]);

  return (
    <Card
      onMouseOver={() => setCardHover(true)}
      onMouseOut={() => setCardHover(false)}
      raised={cardHover}
      sx={{
        borderRadius: '16px',
        display: 'flex',
        flexDirection: viewState == 'list' ? 'row' : 'column',
        width: '100%',
        height: 'auto',
      }}
    >
      <CardActionArea
        LinkComponent={Link}
        href={
          `/product-detail?type_id=${batch.productType?.id}&id=${batch.product?.id}` ??
          ''
        }
        sx={{
          width: viewState == 'list' ? '50%' : '100%',
          height: viewState == 'list' ? imageHeightList : imageHeight,
        }}
      >
        <Box
          fill={true}
          component={Image}
          sx={cardHover ? imageStyles.cardHovered : imageStyles.cardNormal}
          alt=""
          src={img}
          loading="lazy"
        />
      </CardActionArea>
      <CardActions
        sx={{
          p: 0,
          bgcolor: theme.palette.common.white,
          zIndex: 1,
          width: viewState == 'list' ? '50%' : '100%',
          height: 'auto',
          maxHeight: viewState ? imageHeightList : imageHeight,
        }}
      >
        <Grid
          container
          direction={viewState == 'list' ? 'column' : 'row'}
          justifyContent={'space-between'}
          alignItems={viewState == 'list' ? 'start' : 'center'}
          sx={{
            p: 2,
            zIndex: 1,
            width: '100%',
            height: 'auto',
          }}
          spacing={1}
        >
          <Grid item xs={viewState == 'list' ? 'auto' : 9}>
            <Grid
              container
              direction={'column'}
              justifyContent={'space-between'}
              alignItems={'start'}
              spacing={1}
              sx={{
                height: '100%',
                width: '100%',
              }}
            >
              <Grid item sx={{ width: '100%' }}>
                <Typography
                  variant="body1"
                  color={theme.palette.common.black}
                  sx={{
                    width: '100%',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    wordBreak: 'break-word',
                  }}
                >
                  {batch.product?.name}
                </Typography>
                <Typography
                  variant="body2"
                  color={theme.palette.text.secondary}
                  display={viewState == 'list' ? 'block' : 'none'}
                  sx={{
                    maxHeight: '10vh',
                    whiteSpace: 'normal',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    wordBreak: 'break-word',
                    fontWeight: 'medium',
                  }}
                >
                  {batch.product?.description ?? ''}
                </Typography>
              </Grid>
              <Grid item>
                <Grid
                  container
                  justifyContent={'flex-start'}
                  alignItems={'center'}
                  direction={'row'}
                  spacing={1}
                >
                  <Grid item>
                    <Typography
                      variant="body2"
                      color={theme.palette.text.secondary}
                    >
                      Giá:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="body2"
                      color={theme.palette.secondary.main}
                      sx={
                        batch.discount.start_at <= new Date()
                          ? {
                              textDecoration: 'line-through',
                              color: theme.palette.common.black,
                            }
                          : {}
                      }
                    >
                      {formatPrice(batch.variant?.price ?? 0)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid
                  container
                  justifyContent={'flex-start'}
                  alignItems={'center'}
                  direction={'row'}
                  spacing={1}
                >
                  <Grid item sx={{ visibility: 'hidden' }}>
                    <Typography
                      variant="body2"
                      color={theme.palette.text.secondary}
                    >
                      Giá:
                    </Typography>
                  </Grid>
                  {/* TODO: HUY - Fix this */}
                  <Grid
                    item
                    sx={
                      batch.discount.start_at <= new Date()
                        ? { display: 'block' }
                        : { display: 'none' }
                    }
                  >
                    <Typography
                      variant="body2"
                      color={theme.palette.secondary.main}
                      sx={{
                        fontStyle: 'italic',
                      }}
                    >
                      {formatPrice(
                        (batch.variant?.price ?? 0) *
                          (1 - batch.discount.percent / 100)
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={viewState == 'list' ? 'auto' : 'auto'}>
            <Box
              component={'div'}
              sx={{
                bgcolor: theme.palette.secondary.main,
                borderRadius: '8px',
              }}
            >
              <CustomIconButton>
                <ShoppingCart
                  sx={{
                    color: theme.palette.common.white,
                    display: viewState == 'list' ? 'none' : 'block',
                  }}
                />
                <Typography
                  variant="body2"
                  color={theme.palette.common.white}
                  display={viewState == 'list' ? 'block' : 'none'}
                  sx={{
                    px: 0.5,
                  }}
                >
                  Thêm vào giỏ hàng
                </Typography>
              </CustomIconButton>
            </Box>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}

export default CakeCard;
