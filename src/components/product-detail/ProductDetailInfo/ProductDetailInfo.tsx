import { NumberInputWithButtons } from '@/components/Inputs/MultiValue';
import CheckboxButtonGroup from '@/components/Inputs/MultiValue/CheckboxButtonGroup';
import { CustomButton } from '@/components/buttons';
import { ProductDetailInfoProps } from '@/lib/types/product-detail';
import { formatPrice } from '@/lib/utils';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import { useMemo } from 'react';
import MyDivider from '../Divider/Divider';
import ProductCarousel from '../ProductCarousel';
import ProductRating from '../ProductRating';

function ProductDetailInfo({
  comments,
  variant,
  onVariantChange,
  batch,
  onBatchChange,
  quantity,
  onQuantityChange,
  product,
  onAddToCart,
  batchOptions,
}: ProductDetailInfoProps) {
  const theme = useTheme();

  const price: string = useMemo(() => {
    if (!product) return formatPrice(0);

    const prices = product.variants.map((v) => v.price);

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    if (min === max) return formatPrice(min);
    else return `${formatPrice(min)} - ${formatPrice(max)}`;
  }, [product.variants]);

  const isProductAvailable: boolean = useMemo(() => {
    if (!product.batches || product.batches.length <= 0) return false;

    return true;
  }, [product.batches]);

  const maxQuantity = useMemo(() => {
    let max = 0;

    if (batch) max = batch.totalQuantity - batch.soldQuantity;

    return max;
  }, [batch]);

  const [itemPrice, totalPrice] = useMemo(() => {
    if (!batch || !variant) return [0, 0];

    const itemPrice = variant.price;
    const totalPrice = itemPrice * quantity;

    return [itemPrice, totalPrice];
  }, [batch, quantity]);

  return (
    <Grid
      container
      direction={'row'}
      justifyContent={'center'}
      alignItems={'start'}
      spacing={4}
    >
      <Grid item xs={12}>
        <ProductCarousel images={product.images} />
      </Grid>

      <Grid item xs={12} md={8} lg={6}>
        <Box
          sx={{
            border: 3,
            borderColor: (theme) => theme.palette.secondary.main,
            borderRadius: '8px',
            overflow: 'hidden',
            p: 2,
          }}
        >
          <Grid
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={2}
          >
            <Grid item xs={12}>
              <Typography variant="h2" color={theme.palette.secondary.main}>
                {product.name}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <ProductRating
                rating={comments.ratingAverage}
                numReviews={comments.numReviews}
              />
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
              >
                <Grid item xs={3}>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.secondary}
                  >
                    Giá tiền:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body1">{price}</Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
              >
                <Grid item xs={3}>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.secondary}
                  >
                    Loại:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body1">{product.type.name}</Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
              >
                <Grid item xs={3}>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.secondary}
                  >
                    Trạng thái:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography
                    variant="body1"
                    color={
                      isProductAvailable
                        ? theme.palette.success.main
                        : theme.palette.error.main
                    }
                  >
                    {isProductAvailable ? 'Còn hàng' : 'Không còn hàng'}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
              >
                <Grid item xs={3}>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.secondary}
                  >
                    Mô tả:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body1">{product.description}</Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
              >
                <Grid item xs={3}>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.secondary}
                  >
                    Nguyên liệu:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body1">
                    {product.ingredients.join(', ')}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
              >
                <Grid item xs={3}>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.secondary}
                  >
                    Cách dùng:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body1">{product.howToUse}</Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
              >
                <Grid item xs={3}>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.secondary}
                  >
                    Bảo quản:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography variant="body1">
                    {product.preservation}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={12} md={8} lg={6}>
        <Box
          sx={{
            border: 3,
            borderColor: theme.palette.secondary.main,
            borderRadius: '8px',
            overflow: 'hidden',
            p: 2,
          }}
        >
          <Grid
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            spacing={2}
          >
            <Grid item xs={12}>
              <Typography variant="h2" color={theme.palette.secondary.main}>
                Phần bạn chọn
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
              >
                <Grid item xs={3}>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.secondary}
                  >
                    Biến thể:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <CheckboxButtonGroup
                    options={product.variants}
                    value={variant}
                    getOptionLabel={(o) => `${o.material} - ${o.size}`}
                    onChange={onVariantChange}
                    valueEqualOption={(value, option) =>
                      value?.id === option.id
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
              >
                <Grid item xs={3}>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.secondary}
                  >
                    Ngày hết hạn:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <CheckboxButtonGroup
                    options={batchOptions}
                    value={batch}
                    getOptionLabel={(batch) =>
                      // TODO: fix this formating
                      batch.EXP.toLocaleString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })
                    }
                    onChange={onBatchChange}
                    valueEqualOption={(value, option) =>
                      value?.id === option.id
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
              >
                <Grid item xs={3}>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.secondary}
                  >
                    Số lượng:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <NumberInputWithButtons
                    min={0}
                    max={maxQuantity}
                    value={quantity}
                    onChange={onQuantityChange}
                  />
                </Grid>
              </Grid>
            </Grid>

            <MyDivider />

            <Grid item xs={12}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
              >
                <Grid item xs={3}>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.secondary}
                  >
                    Giá:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography>{formatPrice(itemPrice)}</Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
              >
                <Grid item xs={3}>
                  <Typography
                    variant="body1"
                    color={theme.palette.text.secondary}
                  >
                    Tổng tiền:
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography>{formatPrice(totalPrice)}</Typography>
                </Grid>
              </Grid>
            </Grid>

            <MyDivider />

            <Grid item xs={12}>
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'start'}
              >
                <CustomButton
                  onClick={() => onAddToCart()}
                  sx={{
                    py: 1.5,
                    width: '100%',
                    borderRadius: '8px',
                  }}
                >
                  <Typography
                    variant="body1"
                    color={theme.palette.common.white}
                  >
                    Thêm vào giỏ hàng
                  </Typography>
                </CustomButton>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}

export default ProductDetailInfo;
