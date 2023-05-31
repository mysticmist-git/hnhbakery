import { Grid, Skeleton, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import formatPrice from '@/utilities/formatCurrency';
import { DisplayCartItem } from '@/lib/contexts/cartContext';

export function DanhSachSanPham_Item(props: any) {
  const { item }: { item: DisplayCartItem } = props;
  const {
    id,
    name,
    image,
    size,
    material,
    quantity,
    MFG,
    EXP,
    price,
    discountPrice,
    discountPercent,
  } = item;
  const theme = useTheme();
  const [isHover, setIsHover] = useState(false);

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

  const totalPrice = useMemo(() => {
    const appliedPrice =
      discountPrice && discountPrice > 0 ? discountPrice : price;

    return appliedPrice * quantity;
  }, [quantity, discountPrice, price]);

  const [isLoading, setIsLoading] = useState(true);
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      <Grid
        container
        spacing={1}
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        onMouseOver={() => setIsHover(true)}
        onMouseOut={() => setIsHover(false)}
      >
        <Grid item xs={3} alignSelf={'stretch'}>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              minHeight: '184px',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '8px',
            }}
          >
            {isLoading ? (
              <Skeleton
                variant="rectangular"
                width={'100%'}
                height={'100%'}
                sx={{
                  minHeight: '184px',
                }}
              />
            ) : null}
            <Box
              component={Image}
              src={image}
              alt={name}
              loading="lazy"
              fill={true}
              sx={isHover ? style.hover : style.normal}
              onLoad={handleImageLoad}
            />
          </Box>
        </Grid>

        <Grid item xs={9}>
          <Grid
            container
            spacing={0}
            direction={'row'}
            alignItems={'start'}
            justifyContent={'center'}
            sx={{
              py: 0.5,
            }}
          >
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="button"
                  color={theme.palette.text.secondary}
                >
                  Tên sản phẩm:{' '}
                </Typography>
                <Typography variant="body2" color={theme.palette.common.black}>
                  {name}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="button"
                  color={theme.palette.text.secondary}
                >
                  Kích cỡ:{' '}
                </Typography>
                <Typography variant="body2" color={theme.palette.common.black}>
                  {size}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="button"
                  color={theme.palette.text.secondary}
                >
                  Vật liệu:{' '}
                </Typography>
                <Typography variant="body2" color={theme.palette.common.black}>
                  {material}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="button"
                  color={theme.palette.text.secondary}
                >
                  Số lượng:{' '}
                </Typography>
                <Typography variant="body2" color={theme.palette.common.black}>
                  {quantity}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="button"
                  color={theme.palette.text.secondary}
                >
                  Sản xuất:{' '}
                </Typography>
                <Typography variant="body2" color={theme.palette.common.black}>
                  {new Date(MFG).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="button"
                  color={theme.palette.text.secondary}
                >
                  Hết hạn:{' '}
                </Typography>
                <Typography
                  variant="body2"
                  color={theme.palette.common.black}
                  sx={{
                    fontWeight: 'bold',
                  }}
                >
                  {new Date(EXP).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                }}
              >
                <Typography
                  variant="button"
                  color={theme.palette.text.secondary}
                >
                  Giá bán /sản phẩm:{' '}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'end',
                  }}
                >
                  <Typography
                    variant="body2"
                    color={theme.palette.text.secondary}
                    sx={{
                      textDecoration:
                        discountPrice && discountPrice > 0
                          ? 'line-through'
                          : 'none',
                      lineHeight: theme.typography.button.lineHeight,
                    }}
                  >
                    {formatPrice(price)}
                  </Typography>
                  {discountPrice && discountPrice > 0 && (
                    <Typography
                      variant="body2"
                      align="right"
                      color={theme.palette.success.main}
                      sx={{
                        fontWeight: 'bold',
                      }}
                    >
                      {'(-' +
                        discountPercent! +
                        '%) ' +
                        formatPrice(discountPrice)}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  borderTop: 1.5,
                  borderColor: theme.palette.text.secondary,
                  pt: 1,
                  mt: 1,
                }}
              >
                <Typography
                  variant="body1"
                  color={theme.palette.text.secondary}
                >
                  Tổng:{' '}
                </Typography>
                <Typography
                  variant="body1"
                  align="right"
                  color={theme.palette.secondary.main}
                  sx={{
                    fontWeight: 'bold',
                  }}
                >
                  {formatPrice(totalPrice)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
