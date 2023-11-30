import { CustomButton } from '@/components/buttons';
import { NumberInputWithButtons } from '@/components/inputs/MultiValue';
import CheckboxButtonGroup from '@/components/inputs/MultiValue/CheckboxButtonGroup';
import { ProductDetailInfoProps } from '@/lib/types/product-detail';
import { formatDateString, formatPrice } from '@/lib/utils';
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  TypographyProps,
  useTheme,
} from '@mui/material';
import { useMemo } from 'react';
import { ProductObject, ProductVariant } from '../../../lib/models';
import MyDivider from '../Divider';
import ProductCarousel from '../ProductCarousel';
import ProductRating from '../ProductRating';
import { ProductDetail } from '@/models/product';
import { VariantTableRow } from '@/models/variant';
import Batch from '@/models/batch';
import { SizeNameParse } from '@/models/size';
import { useRouter } from 'next/router';

function ProductDetailInfo({
  productDetail,
  variant,
  onVariantChange,
  batch,
  onBatchChange,
  batchOptions,
  quantity,
  onQuantityChange,
  handleAddToCart,
}: {
  productDetail: ProductDetail | undefined;
  variant: VariantTableRow | undefined;
  onVariantChange: (variant: VariantTableRow) => void;
  batch: Batch | undefined;
  onBatchChange: (batch: Batch) => void;
  batchOptions: Batch[];
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  handleAddToCart: () => void;
}) {
  const theme = useTheme();
  const router = useRouter();

  const [minPrice, maxPrice, priceValue]: [
    minPrice: number,
    maxPrice: number,
    priceValue: string
  ] = useMemo(() => {
    if (!productDetail) return [0, 0, formatPrice(0)];

    if (!productDetail.variants || productDetail.variants.length <= 0)
      return [0, 0, 'Hết hàng'];

    const prices = productDetail.variants.map((v) => v.price);

    const min = Math.min(...prices);

    let max = Math.max(...prices);

    let value = '';

    if (min === max) value = formatPrice(min, ' đồng');
    else value = `${formatPrice(min, ' đồng')} - ${formatPrice(max, ' đồng')}`;

    return [min, max, value];
  }, [productDetail]);

  const isProductAvailable: boolean = useMemo(() => {
    if (!productDetail || !productDetail.variants) return false;

    for (let i = 0; i < productDetail.variants.length; i++) {
      const variant = productDetail.variants[i];
      if (variant.batcheObjects && variant.batcheObjects.length > 0) {
        return true;
      }
    }

    return false;
  }, [productDetail]);

  const maxQuantity = useMemo(() => {
    let max = 1;

    if (batch) max = batch.quantity - batch.sold;

    return max;
  }, [batch]);

  const [itemPrice, itemDiscountPrice, totalPrice, discountTotalPrice] =
    useMemo(() => {
      if (!batch || !variant) return [0, 0, 0, 0];

      const itemPrice = variant.price;

      let itemDiscountPrice = 0;

      if (new Date() > new Date(batch.discount.start_at)) {
        itemDiscountPrice = variant.price * (1 - batch.discount.percent / 100);
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
      alignItems={'stretch'}
      spacing={4}
    >
      <Grid item xs={12}>
        <ProductCarousel images={productDetail?.images ?? []} />
      </Grid>

      {!isProductAvailable && (
        <Grid item xs={12}>
          <Box
            component={'div'}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Typography
              variant="body1"
              sx={{ textAlign: 'center', color: 'grey.700' }}
            >
              Sản phẩm đã hết hàng vui lòng chọn sản phẩm khác hoặc liên hệ cửa
              hàng để được tư vấn.
            </Typography>

            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2, minWidth: 200 }}
              onClick={() => {
                router.push('/contact');
              }}
            >
              Liên hệ
            </Button>
          </Box>
        </Grid>
      )}

      <Grid item xs={12} md={8} lg={6}>
        <Box
          component={'div'}
          sx={{
            height: '100%',
            border: 3,
            borderColor: (theme) => theme.palette.secondary.main,
            borderRadius: '8px',
            overflow: 'hidden',
            p: 3,
            backgroundColor: 'white',
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
                {productDetail?.name ?? ''}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <ProductRating
                rating={
                  productDetail?.feedbacks !== undefined
                    ? productDetail?.feedbacks.reduce(
                        (total, feedbacks) => total + feedbacks.rating,
                        0
                      ) / productDetail?.feedbacks.length
                    : 0
                }
                numReviews={
                  productDetail?.feedbacks !== undefined
                    ? productDetail?.feedbacks.length
                    : 0
                }
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
                  <Typography {...typoHeadStyle}>Giá tiền:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography {...typoContentStyle}>{priceValue}</Typography>
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
                  <Typography {...typoHeadStyle}>Loại:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography {...typoContentStyle}>
                    {productDetail?.productType?.name ?? 'Trống'}
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
                  <Typography {...typoHeadStyle}>Mô tả:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography {...typoContentStyle}>
                    {productDetail?.description ?? ''}
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
                  <Typography {...typoHeadStyle}>Nguyên liệu:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography {...typoContentStyle}>
                    {productDetail?.ingredients.join(', ') ?? 'Trống'}
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
                  <Typography {...typoHeadStyle}>Cách dùng:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography {...typoContentStyle}>
                    {productDetail?.how_to_use ?? 'Trống'}
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
                  <Typography {...typoHeadStyle}>Bảo quản:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography {...typoContentStyle}>
                    {productDetail?.preservation ?? 'Trống'}
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
                  <Typography {...typoHeadStyle}>Trạng thái:</Typography>
                </Grid>
                <Grid item xs={9}>
                  <Typography
                    {...typoContentStyle}
                    color={
                      isProductAvailable
                        ? theme.palette.success.main
                        : theme.palette.error.main
                    }
                    fontWeight={'bold'}
                  >
                    {isProductAvailable ? 'Còn hàng' : 'Không còn hàng'}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Grid>

      {productDetail?.variants &&
        productDetail.variants.length > 0 &&
        isProductAvailable && (
          <Grid item xs={12} md={8} lg={6}>
            <Box
              component={'div'}
              sx={{
                height: '100%',
                border: 3,
                borderColor: theme.palette.secondary.main,
                borderRadius: '8px',
                overflow: 'hidden',
                p: 3,
                backgroundColor: 'white',
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
                      <Typography {...typoHeadStyle}>Biến thể:</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <CheckboxButtonGroup
                        options={
                          productDetail?.variants.filter(
                            (v) =>
                              v.batcheObjects && v.batcheObjects?.length > 0
                          ) ?? []
                        }
                        value={variant}
                        getOptionLabel={(o) =>
                          `${o.material} - ${SizeNameParse(o.size)}`
                        }
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
                      <Typography {...typoHeadStyle}>Ngày hết hạn:</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <CheckboxButtonGroup
                        options={batchOptions ?? []}
                        value={batch}
                        getOptionLabel={(batch) => {
                          return formatDateString(batch?.exp);
                        }}
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
                      <Typography {...typoHeadStyle}>Số lượng:</Typography>
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
                      <Typography {...typoHeadStyle}>Giá:</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Stack direction={'row'} gap={1}>
                        <Typography
                          {...typoContentStyle}
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
                            {...typoContentStyle}
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
                      <Typography {...typoHeadStyle}>Tổng tiền:</Typography>
                    </Grid>
                    <Grid item xs={9}>
                      <Typography {...typoContentStyle}>
                        {formatPrice(
                          discountTotalPrice > 0
                            ? discountTotalPrice
                            : totalPrice
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
                      onClick={() => handleAddToCart()}
                      sx={{
                        py: 1,
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
        )}
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

const typoContentStyle: TypographyProps = {
  variant: 'body1',
  fontWeight: 'regular',
};

const typoHeadStyle: TypographyProps = {
  variant: 'body1',
  color: 'text.secondary',
};
