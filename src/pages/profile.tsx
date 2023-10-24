import ImageBackground from '@/components/Imagebackground';
import { CustomIconButton } from '@/components/buttons';
import Outlined_TextField from '@/components/order/MyModal/Outlined_TextField';
import { LeftProfileColumn } from '@/components/profile';
import RightProfileColumn from '@/components/profile/RightProfileColumn';
import { auth } from '@/firebase/config';
import {
  getUserByUid,
  getUserTableRowByUID,
  updateUser,
} from '@/lib/DAO/userDAO';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import { getCollection, updateDocToFirestore } from '@/lib/firestore';
import useUserData from '@/lib/hooks/userUserData';
// import { billStatusParse } from '@/lib/manage/manage';
import { BillObject, UserObject } from '@/lib/models';
import { formatDateString, formatPrice } from '@/lib/utils';
import {
  BillTableRow,
  billStateColorParse,
  billStateContentParse,
} from '@/models/bill';
import User, { UserTableRow } from '@/models/user';
import { ContentCopyRounded, ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  InputAdornment,
  Link,
  Skeleton,
  Tooltip,
  Typography,
  TypographyProps,
  useTheme,
} from '@mui/material';
import { Stack } from '@mui/system';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import promotionImage from '@/assets/promotion.png';
import {
  deliveryStateColorParse,
  deliveryStateContentParse,
} from '@/models/delivery';
import { BillItemTableRow } from '@/models/billItem';
import { SizeNameParse } from '@/models/size';

const Profile = () => {
  const router = useRouter();

  // #region states

  const [user, userLoading, userError] = useAuthState(auth);
  // const [myBills, setMyBills] = useState<BillObject[]>([]);
  const [userData, setUserData] = useState<UserTableRow>();

  useEffect(() => {
    if (!user && !userLoading) {
      router.push('/');
    }
  }, [router, user, userLoading]);

  useEffect(() => {
    const fetchData = async () => {
      setUserData(await getUserTableRowByUID(user?.uid ?? ''));
    };

    fetchData();
  }, [user]);

  console.log(userData?.bills);

  // #endregion

  // #region Hooks

  const theme = useTheme();

  // #endregion

  const handleUpdateUserData = async (
    field: keyof User,
    value: User[keyof User]
  ) => {
    if (!userData) return;
    const { bills, addresses, feedbacks, ...data } = userData;
    const updateData = { ...data, [field]: value };

    await updateUser(data.group_id, data.id, updateData);
    setUserData({ ...userData, [field]: value });
    handleSnackbarAlert('success', 'Cập nhật thành công');
  };

  const handleSnackbarAlert = useSnackbarService();

  return (
    <>
      <ImageBackground>
        <Grid
          sx={{ px: 6 }}
          height={'100%'}
          container
          direction={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          spacing={2}
        >
          <Grid item>
            <Link href="#" style={{ textDecoration: 'none' }}>
              <Typography
                align="center"
                variant="h1"
                color={theme.palette.primary.main}
                sx={{
                  '&:hover': {
                    color: theme.palette.common.white,
                  },
                }}
              >
                Thông tin cá nhân
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </ImageBackground>

      {!user ? undefined : (
        <Box
          sx={{
            pt: 6,
            pb: 12,
            px: { xs: 2, sm: 2, md: 4, lg: 8 },
            overflow: 'visible',
          }}
        >
          <Grid
            container
            spacing={2}
            justifyContent={'center'}
            alignItems={'flex-start'}
          >
            <Grid item xs={12} sm={4} md={3}>
              {userLoading ? (
                <Skeleton
                  animation="wave"
                  width={'100%'}
                  height={320}
                  variant="rounded"
                />
              ) : (
                <Box
                  sx={{
                    backgroundColor: theme.palette.common.white,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: 3,
                    p: 2,
                  }}
                >
                  <LeftProfileColumn
                    image={userData?.avatar ?? ''}
                    userId={userData?.id ?? ''}
                    onUpdateUserData={handleUpdateUserData}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={8} md={9}>
              {userLoading ? (
                <Skeleton
                  animation="wave"
                  width={'100%'}
                  height={520}
                  variant="rounded"
                />
              ) : (
                <RightProfileColumn
                  user={user}
                  userData={userData}
                  onUpdateUserData={handleUpdateUserData}
                />
              )}
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <Box
                sx={{
                  backgroundColor: theme.palette.common.white,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: 3,
                  p: 2,
                }}
              >
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item xs={12}>
                    <Typography
                      align="center"
                      variant="button"
                      color={theme.palette.common.black}
                    >
                      Đơn hàng của bạn
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {userData?.bills?.map((bill) => {
              return (
                <>
                  <Grid key={bill.id} item xs={12}>
                    <Accordion
                      sx={{
                        border: 1,
                        borderColor: 'black',
                        boxShadow: 0,
                        '&.MuiAccordion-rounded': {
                          borderRadius: 3,
                        },
                        backgroundColor: 'transparent',
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box
                          sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            pr: 2,
                          }}
                        >
                          <Typography variant="button" fontWeight={'regular'}>
                            Mã hóa đơn: {bill.id}
                          </Typography>
                          <Typography variant="button" fontWeight={'regular'}>
                            {formatDateString(bill.created_at)}
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <BillAccordionContent bill={bill} />
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                </>
              );
            })}

            {(!userData?.bills || userData?.bills?.length == 0) && (
              <Grid item xs={12}>
                <Typography
                  align="center"
                  variant="body2"
                  color={theme.palette.common.black}
                >
                  Chưa có đơn hàng nào
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      )}
    </>
  );
};
export default Profile;

function BillAccordionContent({ bill }: { bill: BillTableRow }) {
  const theme = useTheme();
  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item md={5} xs={12}>
          <Stack direction="column" spacing={1} divider={<Divider flexItem />}>
            <Box>
              <Stack direction="column" spacing={1}>
                <Typography variant="button" fontWeight={'bold'}>
                  Thông tin đơn hàng
                </Typography>
                <Box sx={BoxStyle}>
                  <Typography {...TypoStyle}>Mã hóa đơn:</Typography>

                  <Typography {...TypoStyle}>{bill.id ?? 'Trống'}</Typography>
                </Box>

                <Box sx={BoxStyle}>
                  <Typography {...TypoStyle}>Trạng thái:</Typography>

                  <Typography
                    {...TypoStyle}
                    fontWeight={'bold'}
                    color={
                      billStateColorParse(theme, bill.state) ??
                      theme.palette.common.black
                    }
                  >
                    {billStateContentParse(bill.state)}
                  </Typography>
                </Box>

                <Box sx={BoxStyle}>
                  <Typography {...TypoStyle}>Hình thức thanh toán:</Typography>

                  <Typography {...TypoStyle}>
                    {bill.paymentMethod?.name}
                  </Typography>
                </Box>

                <Box sx={BoxStyle}>
                  <Typography {...TypoStyle}>Thời gian thanh toán:</Typography>

                  <Typography {...TypoStyle}>
                    {formatDateString(bill.paid_time) ?? 'Trống'}
                  </Typography>
                </Box>

                <Box sx={BoxStyle}>
                  <Typography {...TypoStyle}>Ghi chú:</Typography>

                  <Typography {...TypoStyle}>{bill.note ?? 'Trống'}</Typography>
                </Box>

                <Box sx={BoxStyle}>
                  <Typography {...TypoStyle}>Tổng tiền:</Typography>

                  <Typography {...TypoStyle}>
                    {formatPrice(bill.total_price, ' đồng') ?? 'Trống'}
                  </Typography>
                </Box>

                <Box sx={BoxStyle}>
                  <Typography {...TypoStyle}>Khuyến mãi:</Typography>

                  <Typography {...TypoStyle}>
                    {'-' + formatPrice(bill.total_discount, ' đồng') ?? 'Trống'}
                  </Typography>
                </Box>

                <Box sx={BoxStyle}>
                  <Typography {...TypoStyle}>Thành tiền:</Typography>

                  <Typography {...TypoStyle}>
                    {formatPrice(bill.final_price, ' đồng') ?? 'Trống'}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box>
              <Stack direction="column" spacing={1}>
                <Typography variant="button" fontWeight={'bold'}>
                  Thông tin vận chuyển
                </Typography>

                <Box sx={BoxStyle}>
                  <Typography {...TypoStyle}>Người nhận:</Typography>

                  <Typography {...TypoStyle}>
                    {bill.deliveryTableRow?.name ?? 'Trống'}
                  </Typography>
                </Box>

                <Box sx={BoxStyle}>
                  <Typography {...TypoStyle}>Số điện thoại:</Typography>

                  <Typography {...TypoStyle}>
                    {bill.deliveryTableRow?.tel ?? 'Trống'}
                  </Typography>
                </Box>

                <Box sx={BoxStyle}>
                  <Typography {...TypoStyle}>Ngày đặt giao:</Typography>

                  <Typography {...TypoStyle}>
                    {formatDateString(
                      bill.deliveryTableRow?.ship_date,
                      'DD/MM/YYYY'
                    ) ?? 'Trống'}
                  </Typography>
                </Box>

                <Box sx={BoxStyle}>
                  <Typography {...TypoStyle}>Thời gian đặt giao:</Typography>

                  <Typography {...TypoStyle}>
                    {bill.deliveryTableRow?.ship_time ?? 'Trống'}
                  </Typography>
                </Box>

                <Box sx={BoxStyle}>
                  <Typography {...TypoStyle}>Địa chỉ giao hàng:</Typography>

                  <Typography {...TypoStyle}>
                    {bill.deliveryTableRow?.address?.address ?? 'Trống'}
                  </Typography>
                </Box>

                <Box sx={BoxStyle}>
                  <Typography {...TypoStyle}>Ghi chú:</Typography>

                  <Typography {...TypoStyle}>
                    {bill.deliveryTableRow?.delivery_note ?? 'Trống'}
                  </Typography>
                </Box>

                <Box sx={BoxStyle}>
                  <Typography {...TypoStyle}>Trạng thái:</Typography>

                  <Typography
                    {...TypoStyle}
                    color={
                      deliveryStateColorParse(
                        theme,
                        bill.deliveryTableRow?.state
                      ) ?? 'black'
                    }
                    fontWeight={'bold'}
                  >
                    {deliveryStateContentParse(bill.deliveryTableRow?.state) ??
                      'Trống'}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box
              sx={{
                display: bill.sale ? 'block' : 'none',
              }}
            >
              <Stack direction="column" spacing={1}>
                <Typography variant="button" fontWeight={'bold'}>
                  Thông tin khuyến mãi
                </Typography>
                <Box
                  component={'img'}
                  loading="lazy"
                  alt=""
                  src={promotionImage.src}
                  sx={{
                    objectFit: 'contain',
                    height: '90px',
                    aspectRatio: '1/1',
                  }}
                />

                <Box sx={BoxStyle}>
                  <Typography {...TypoStyle}>Tên khuyến mãi:</Typography>

                  <Typography {...TypoStyle}>
                    {bill.sale?.name ?? 'Trống'}
                  </Typography>
                </Box>

                <Box sx={BoxStyle}>
                  <Typography {...TypoStyle}>Chương trình giảm giá:</Typography>

                  <Typography {...TypoStyle}>
                    {`Giảm ${bill.sale?.percent ?? 0}%, tối đa ${formatPrice(
                      bill.sale?.limit,
                      ' đồng'
                    )}` ?? 'Trống'}
                  </Typography>
                </Box>

                <Box sx={BoxStyle}>
                  <Typography {...TypoStyle}>Mã code:</Typography>

                  <Typography
                    {...TypoStyle}
                    fontWeight={'bold'}
                    color={'error'}
                  >
                    {bill.sale?.code ?? 'Trống'}
                  </Typography>
                </Box>

                <Box sx={BoxStyle}>
                  <Typography {...TypoStyle}>Thời gian áp dụng:</Typography>

                  <Typography {...TypoStyle}>
                    {formatDateString(bill.sale?.start_at) +
                      ' - ' +
                      formatDateString(bill.sale?.end_at) ?? 'Trống'}
                  </Typography>
                </Box>

                <Box sx={BoxStyle}>
                  <Typography {...TypoStyle}>Mô tả:</Typography>

                  <Typography {...TypoStyle}>
                    {bill.sale?.description ?? 'Trống'}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} md={7}>
          <Stack direction="column" spacing={1}>
            <Typography variant="button" fontWeight={'bold'}>
              Danh sách sản phẩm
            </Typography>
            {bill?.billItems?.map((item, index) => (
              <BillItemsContent key={index} item={item} />
            ))}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

const BoxStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
};

const TypoStyle: TypographyProps = {
  variant: 'caption',
  fontWeight: 'regular',
};

function BillItemsContent({ item }: { item: BillItemTableRow }) {
  const theme = useTheme();
  return (
    <>
      <Box
        sx={{
          width: '100%',
          backgroundColor: 'grey.200',
          border: 1,
          borderRadius: 3,
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          py: 3,
          pl: 2,
          pr: 4,
        }}
      >
        <Grid container justifyContent={'center'} spacing={4}>
          <Grid item xs={4}>
            <Box
              component={'img'}
              loading="lazy"
              alt={item.product?.name ?? ''}
              // src={item.product?.images[0] ?? promotionImage.src}
              src={promotionImage.src}
              sx={{
                objectFit: 'contain',
                width: '100%',
                height: '100%',
                borderRadius: 3,
                background: 'red',
              }}
            />
          </Grid>
          <Grid item xs={8}>
            <Stack direction="column" spacing={1}>
              <Typography variant="body1">{item.product?.name}</Typography>

              <Box sx={BoxStyle}>
                <Typography {...TypoStyle}>Size:</Typography>

                <Typography {...TypoStyle}>
                  {SizeNameParse(item.variant?.size)}
                </Typography>
              </Box>

              <Box sx={BoxStyle}>
                <Typography {...TypoStyle}>Vật liệu:</Typography>

                <Typography {...TypoStyle}>{item.variant?.material}</Typography>
              </Box>

              <Box sx={BoxStyle}>
                <Typography {...TypoStyle}>Số lượng:</Typography>

                <Typography {...TypoStyle}>{item.amount ?? '0'}</Typography>
              </Box>

              <Box sx={BoxStyle}>
                <Typography {...TypoStyle}>Ngày sản xuất:</Typography>

                <Typography {...TypoStyle}>
                  {formatDateString(item.batch?.mfg) ?? 'Trống'}
                </Typography>
              </Box>

              <Box sx={BoxStyle}>
                <Typography {...TypoStyle}>Ngày hết hạn:</Typography>

                <Typography {...TypoStyle}>
                  {formatDateString(item.batch?.exp) ?? 'Trống'}
                </Typography>
              </Box>

              <Box sx={BoxStyle}>
                <Typography {...TypoStyle}>Giá bán:</Typography>

                <Typography {...TypoStyle}>
                  {formatPrice(item.price, ' đồng') + ' / sản phẩm' ?? 'Trống'}
                </Typography>
              </Box>

              <Box sx={BoxStyle}>
                <Typography {...TypoStyle}>Giảm giá:</Typography>

                <Typography {...TypoStyle}>
                  {` Giảm ${formatPrice(item.total_discount, ' đồng')} (${
                    item.discount
                  }%) / sản phẩm` ?? 'Trống'}
                </Typography>
              </Box>

              <Box sx={BoxStyle}>
                <Typography {...TypoStyle}>Thành tiền:</Typography>

                <Typography {...TypoStyle}>
                  {formatPrice(item.final_price, ' đồng') ?? 'Trống'}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
