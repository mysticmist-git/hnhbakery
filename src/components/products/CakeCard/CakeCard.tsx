import { CustomIconButton } from '@/components/buttons';
import ProductsContext from '@/lib/contexts/productsContext';
import { formatPrice } from '@/lib/utils';
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
import { useContext, useMemo, useState } from 'react';

type CakeCardProps = {
  name: string;
  description: string;
  image: string;
  href: string;
  price: number;
  discountPrice: number;
  discounted: boolean;
  imageHeight: number;
  imageHeightList: number;
};

//#endregion
function CakeCard({
  name,
  image,
  description,
  href,
  price,
  discountPrice,
  discounted,
  imageHeight,
  imageHeightList,
}: CakeCardProps) {
  // #region States
  const [cardHover, setCardHover] = useState(false);

  // #endregion
  // #region Hooks
  const theme = useTheme();
  const context = useContext(ProductsContext);

  // #endregion
  // #region useEffects
  // #endregion
  const isList = useMemo(() => context.View === 'list', [context.View]);

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

  return (
    <Card
      onMouseOver={() => setCardHover(true)}
      onMouseOut={() => setCardHover(false)}
      raised={cardHover}
      sx={{
        borderRadius: '16px',
        display: 'flex',
        flexDirection: isList ? 'row' : 'column',
        width: '100%',
        height: 'auto',
      }}
    >
      <CardActionArea
        LinkComponent={Link}
        href={href}
        sx={{
          width: isList ? '50%' : '100%',
          height: isList ? imageHeightList : imageHeight,
        }}
      >
        <Box
          fill={true}
          component={Image}
          sx={cardHover ? imageStyles.cardHovered : imageStyles.cardNormal}
          alt=""
          src={image}
          loading="lazy"
        />
      </CardActionArea>
      <CardActions
        sx={{
          p: 0,
          bgcolor: theme.palette.common.white,
          zIndex: 1,
          width: isList ? '50%' : '100%',
          height: 'auto',
          maxHeight: isList ? imageHeightList : imageHeight,
        }}
      >
        <Grid
          container
          direction={isList ? 'column' : 'row'}
          justifyContent={'space-between'}
          alignItems={isList ? 'start' : 'center'}
          sx={{
            p: 2,
            zIndex: 1,
            width: '100%',
            height: 'auto',
          }}
          spacing={1}
        >
          <Grid item xs={isList ? 'auto' : 9}>
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
                  {name}
                </Typography>
                <Typography
                  variant="body2"
                  color={theme.palette.text.secondary}
                  display={isList ? 'block' : 'none'}
                  sx={{
                    maxHeight: '10vh',
                    whiteSpace: 'normal',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    wordBreak: 'break-word',
                    fontWeight: 'medium',
                  }}
                >
                  {description}
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
                        discounted
                          ? {
                              textDecoration: 'line-through',
                              color: theme.palette.common.black,
                            }
                          : {}
                      }
                    >
                      {formatPrice(price)}
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
                  <Grid item sx={!discounted ? { visibility: 'hidden' } : {}}>
                    <Typography
                      variant="body2"
                      color={theme.palette.secondary.main}
                      sx={{
                        fontStyle: 'italic',
                      }}
                    >
                      {formatPrice(discountPrice)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={isList ? 'auto' : 'auto'}>
            <Box
              sx={{
                bgcolor: theme.palette.secondary.main,
                borderRadius: '8px',
              }}
            >
              <CustomIconButton>
                <ShoppingCart
                  sx={{
                    color: theme.palette.common.white,
                    display: isList ? 'none' : 'block',
                  }}
                />
                <Typography
                  variant="body2"
                  color={theme.palette.common.white}
                  display={isList ? 'block' : 'none'}
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
