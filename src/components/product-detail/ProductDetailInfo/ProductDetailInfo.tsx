import { CustomButton } from '@/components/buttons';
import { NumberInputWithButtons } from '@/components/inputs/MultiValue';
import CheckboxButtonGroup from '@/components/inputs/MultiValue/CheckboxButtonGroup';
import { ProductDetailInfoProps } from '@/lib/types/product-detail';
import { formatPrice } from '@/lib/utils';
import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { ProductObject, ProductVariant } from '../../../lib/models';
import MyDivider from '../Divider';
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

  const [minPrice, maxPrice, text]: [
    minPrice: number,
    maxPrice: number,
    text: string
  ] = useMemo(() => {
    if (!product) return [0, 0, formatPrice(0)];

    const prices = product.variants.map((v) => v.price);

    const variantsWithDiscountPrice = create(product.batches, product);

    const min = variantsWithDiscountPrice.reduce(
      (min, v) =>
        Math.min(
          min,
          Math.min(v.price, v.discounted ? v.discountPrice : v.price)
        ),
      Number.MAX_VALUE
    );

    let max = variantsWithDiscountPrice.reduce((max, v) => {
      return Math.max(
        max,
        Math.min(v.price, v.discounted ? v.discountPrice : v.price)
      );
    }, Number.MIN_VALUE);

    let text = '';

    if (min === max) text = formatPrice(min);
    else text = `${formatPrice(min)} - ${formatPrice(max)}`;

    return [min, max, text];
  }, [product]);

  const isProductAvailable: boolean = useMemo(() => {
    if (!product.batches || product.batches.length <= 0) return false;

    return true;
  }, [product.batches]);

  const maxQuantity = useMemo(() => {
    let max = 1;

    if (batch) max = batch.totalQuantity - batch.soldQuantity;

    return max;
  }, [batch]);

  const [itemPrice, itemDiscountPrice, totalPrice, discountTotalPrice] =
    useMemo(() => {
      if (!batch || !variant) return [0, 0, 0, 0];

      const itemPrice = variant.price;

      let itemDiscountPrice = 0;

      if (Date.now() > new Date(batch.discount.date).getTime()) {
        itemDiscountPrice =
          (variant.price * (100 - batch.discount.percent)) / 100;
      }

      const totalPrice = itemPrice * quantity;
      const discountTotalPrice = itemDiscountPrice * quantity;

      return [itemPrice, itemDiscountPrice, totalPrice, discountTotalPrice];
    }, [batch, quantity, variant]);

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
                rating={
                  comments !== undefined
                    ? comments.reduce(
                        (total, comment) => total + comment.rating,
                        0
                      ) / comments.length
                    : 0
                }
                numReviews={comments !== undefined ? comments.length : 0}
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
                  <Typography variant="body1">{text}</Typography>
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
                    getOptionLabel={
                      (batch) => {
                        const label = new Date(batch.EXP).toLocaleString(
                          'vi-VN',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          }
                        );

                        return label;
                      }
                      // TODO: fix this formating
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
                    min={1}
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
                  <Stack direction={'row'} gap={1}>
                    <Typography
                      sx={
                        itemDiscountPrice > 0
                          ? {
                              textDecoration: 'line-through',
                            }
                          : {}
                      }
                    >
                      {formatPrice(itemPrice)}
                    </Typography>
                    {itemDiscountPrice > 0 && (
                      <Typography
                        sx={{
                          color: theme.palette.secondary.main,
                        }}
                      >
                        {formatPrice(itemDiscountPrice)}
                      </Typography>
                    )}
                  </Stack>
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
                  <Typography>
                    {formatPrice(
                      discountTotalPrice > 0 ? discountTotalPrice : totalPrice
                    )}
                  </Typography>
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

interface VariantWithDiscountPrice extends ProductVariant {
  discounted: boolean;
  discountPercent: number;
  discountPrice: number;
}

function create(
  batches: import('../../../lib/models').BatchObjectWithDiscount[],
  product: ProductObject
) {
  const result: VariantWithDiscountPrice[] = batches.map((b) => {
    const variant = product.variants.find((v) => v.id === b.variant_id);

    if (!variant) {
      throw new Error('variant not found');
    }

    const discounted = Date.now() > new Date(b.discount.date).getTime();

    console.log(discounted);

    const discountPercent = b.discount.percent;
    let discountPrice = 0;

    if (discounted) {
      discountPrice = (variant.price * (100 - b.discount.percent)) / 100;
    }

    return {
      ...variant,
      discounted,
      discountPercent: discountPercent,
      discountPrice: discountPrice,
    };
  });

  return result;
}
