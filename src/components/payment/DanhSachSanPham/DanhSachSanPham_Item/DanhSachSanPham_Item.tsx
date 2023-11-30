import { AssembledCartItem } from '@/@types/cart';
import { getDownloadUrlFromFirebaseStorage } from '@/lib/firestore';
import { formatDateString, formatPrice } from '@/lib/utils';
import { Grid, Skeleton, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

function DanhSachSanPham_Item(props: any) {
  //#region Top

  const { item }: { item: AssembledCartItem } = props;

  //#endregion

  //#region Hooks

  const theme = useTheme();

  //#endregion

  //#region States

  const [isHover, setIsHover] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [img, setImg] = useState('');

  //#endregion

  //#region useEffects

  useEffect(() => {
    getDownloadUrlFromFirebaseStorage(item.image)
      .then((url) => {
        setImg(url);
      })
      .catch(() => setImg(''));
  }, [item.image]);

  //#endregion

  //#region Memos

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
    let price = (item.variant?.price ?? 0) - item.discountAmount;

    return price * item.quantity;
  }, [item.discountAmount, item.quantity, item.variant?.price]);

  //#endregion

  //#region Handlers

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  //#endregion

  return (
    <>
      <Grid
        container
        sx={{
          py: 1,
        }}
        spacing={2}
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        onMouseOver={() => setIsHover(true)}
        onMouseOut={() => setIsHover(false)}
      >
        <Grid item xs={4} alignSelf={'stretch'}>
          <Box
            component={'div'}
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
              src={img}
              alt={`${item.product?.name} image`}
              loading="lazy"
              fill={true}
              sx={isHover ? style.hover : style.normal}
              onLoad={handleImageLoad}
            />
          </Box>
        </Grid>

        <Grid item xs={8}>
          <Grid
            container
            spacing={0}
            direction={'row'}
            alignItems={'start'}
            justifyContent={'center'}
            sx={{
              py: 1,
            }}
          >
            <Grid item xs={12}>
              <Box
                component={'div'}
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
                  Tên sản phẩm:
                </Typography>
                <Typography variant="body2" color={theme.palette.common.black}>
                  {item.product?.name ?? ''}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                component={'div'}
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
                  Kích cỡ:
                </Typography>
                <Typography variant="body2" color={theme.palette.common.black}>
                  {item.variant?.size ?? ''}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                component={'div'}
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
                  Vật liệu:
                </Typography>
                <Typography variant="body2" color={theme.palette.common.black}>
                  {item.product?.name ?? ''}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                component={'div'}
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
                  Số lượng:
                </Typography>
                <Typography variant="body2" color={theme.palette.common.black}>
                  {item.quantity}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                component={'div'}
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
                  Sản xuất:
                </Typography>
                <Typography
                  variant="body2"
                  color={theme.palette.common.black}
                  sx={{
                    fontWeight: 'bold',
                  }}
                >
                  {formatDateString(item.batch?.mfg ?? new Date())}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                component={'div'}
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
                  Hết hạn:
                </Typography>
                <Typography
                  variant="body2"
                  color={theme.palette.common.black}
                  sx={{
                    fontWeight: 'bold',
                  }}
                >
                  {formatDateString(item.batch?.exp ?? new Date())}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                component={'div'}
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
                  Giá bán /sản phẩm:
                </Typography>
                <Box
                  component={'div'}
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
                      textDecoration: item.discounted ? 'line-through' : 'none',
                      lineHeight: theme.typography.button.lineHeight,
                    }}
                  >
                    {formatPrice(item.variant?.price ?? 0)}
                  </Typography>
                  {item.discounted && (
                    <Typography
                      variant="body2"
                      align="right"
                      color={theme.palette.success.main}
                      sx={{
                        fontWeight: 'bold',
                      }}
                    >
                      {'(-' +
                        item.batch?.discount.percent +
                        '%) ' +
                        formatPrice(
                          (item.variant?.price ?? 0) - item.discountAmount
                        )}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                component={'div'}
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
                  Tổng:
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

export default DanhSachSanPham_Item;
