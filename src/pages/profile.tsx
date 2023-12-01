import ImageBackground from '@/components/Imagebackground';
import { LeftProfileColumn } from '@/components/profile';
import RightProfileColumn from '@/components/profile/RightProfileColumn';
import { auth } from '@/firebase/config';
import { getUserTableRowByUID, updateUser } from '@/lib/DAO/userDAO';
import { useSnackbarService } from '@/lib/contexts';
// import { billStatusParse } from '@/lib/manage/manage';
import promotionImage from '@/assets/promotion.png';
import useLoadingService from '@/lib/hooks/useLoadingService';
import { formatDateString, formatPrice } from '@/lib/utils';
import {
  BillState as BillStateType,
  BillTableRow,
  billStateColorParse,
  billStateContentParse,
} from '@/models/bill';
import { BillItemTableRow } from '@/models/billItem';
import {
  deliveryStateColorParse,
  deliveryStateContentParse,
} from '@/models/delivery';
import { SizeNameParse } from '@/models/size';
import User, { UserTableRow } from '@/models/user';
import { ExpandMore, SearchRounded } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  Grid,
  InputAdornment,
  Link,
  Skeleton,
  TextField,
  Typography,
  TypographyProps,
  useTheme,
} from '@mui/material';
import { Stack } from '@mui/system';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import BookingItem from '@/models/bookingItem';
import { getDownloadUrlFromFirebaseStorage } from '@/lib/firestore';
import * as diacritics from 'diacritics';
const Profile = () => {
  //#region Hooks

  const router = useRouter();
  const handleSnackbarAlert = useSnackbarService();
  const theme = useTheme();
  const [load, stop] = useLoadingService();

  //#endregion

  // #region states

  const [user, userLoading, userError] = useAuthState(auth);
  // const [myBills, setMyBills] = useState<BillObject[]>([]);
  const [userData, setUserData] = useState<UserTableRow>();

  //#endregion

  //#region UseEffects

  useEffect(() => {
    if (!user && !userLoading) {
      router.push('/');
    }
  }, [router, user, userLoading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        load();
        if (user && user.uid && user.uid != '') {
          const userData = await getUserTableRowByUID(user.uid);
          if (userData) setUserData(userData);
        }
        stop();
      } catch (error) {
        console.log(error);
        stop();
      }
    };

    // fetchData();
  }, [load, stop, user]);

  // #endregion

  //#region Methods

  const reload = useCallback(() => {
    const fetchData = async () => {
      load();
      setUserData(await getUserTableRowByUID(user?.uid ?? ''));
      stop();
    };

    fetchData();
  }, [load, stop, user?.uid]);

  //#endregion

  //#region Handlers

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

  //#endregion

  //#region Search
  const searchInput = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  //#endregion

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
          component={'div'}
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
                  component={'div'}
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
                  reload={reload}
                  onUpdateUserData={handleUpdateUserData}
                />
              )}
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ mb: 2, mt: 4 }}>
                <Chip label="ĐƠN HÀNG CỦA BẠN" color="secondary" />
              </Divider>
            </Grid>

            <Grid item xs={12} sm={12} md={12}>
              <Box component={'div'}>
                <TextField
                  ref={searchInput}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  size="medium"
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRounded fontSize="inherit" />
                      </InputAdornment>
                    ),
                    sx: {
                      fontSize: 'body1.fontSize',
                      backgroundColor: theme.palette.common.white,
                      overflow: 'hidden',
                      boxShadow: 3,
                      px: 2,
                      borderRadius: '40px',
                      '&:hover': {},
                    },
                  }}
                  placeholder="Tìm kiếm theo mã hóa đơn, ngày giờ đặt, trạng thái"
                  sx={{
                    '& fieldset': {
                      border: 'none',
                    },
                  }}
                />
              </Box>
            </Grid>

            {userData?.bills
              ?.filter((bill) => {
                if (searchValue === '') {
                  return true;
                }

                const searchstr = diacritics.remove(searchValue.toLowerCase());

                if (bill.id?.toLowerCase().includes(searchstr)) {
                  return true;
                }

                if (formatDateString(bill.created_at).includes(searchstr)) {
                  return true;
                }
                const billState = diacritics.remove(
                  billStateContentParse(bill.state).toLocaleLowerCase()
                );

                if (billState.includes(searchstr)) {
                  return true;
                }
              })
              .map((bill, i) => {
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
                          <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={2}
                          >
                            <Grid item xs={4}>
                              <Typography
                                variant="button"
                                fontWeight={'regular'}
                              >
                                {i + 1 + '/ '} Mã hóa đơn: {bill.id}
                              </Typography>
                            </Grid>

                            <Grid item xs={4}>
                              <Box component={'div'}>
                                <Typography
                                  variant="body2"
                                  fontWeight={'regular'}
                                  sx={{
                                    flexGrow: 1,
                                    textAlign: 'center',
                                  }}
                                >
                                  Thời gian đặt:{' '}
                                  {formatDateString(bill.created_at)}
                                </Typography>
                              </Box>
                            </Grid>

                            <Grid item xs={4}>
                              <Box component={'div'}>
                                <Typography
                                  variant="body2"
                                  fontWeight={'bold'}
                                  sx={{
                                    color: billStateColorParse(
                                      theme,
                                      bill.state
                                    ),
                                    textAlign: 'center',
                                    width: '100%',
                                  }}
                                >
                                  {billStateContentParse(bill.state)}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
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

export function BillAccordionContent({ bill }: { bill: BillTableRow }) {
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
            <Box component={'div'}>
              <Stack direction="column" spacing={1}>
                <Typography variant="button" fontWeight={'bold'}>
                  Thông tin đơn hàng
                </Typography>
                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Mã hóa đơn:</Typography>

                  <Typography {...TypoStyle}>{bill.id ?? 'Trống'}</Typography>
                </Box>

                <Box component={'div'} sx={BoxStyle}>
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

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Hình thức thanh toán:</Typography>

                  <Typography {...TypoStyle}>
                    {bill.paymentMethod?.name}
                  </Typography>
                </Box>

                {bill.state === 'paid' && (
                  <Box component={'div'} sx={BoxStyle}>
                    <Typography {...TypoStyle}>
                      Thời gian thanh toán:
                    </Typography>

                    <Typography {...TypoStyle}>
                      {formatDateString(bill.paid_time) ?? 'Trống'}
                    </Typography>
                  </Box>
                )}

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Ghi chú:</Typography>

                  <Typography {...TypoStyle}>{bill.note ?? 'Trống'}</Typography>
                </Box>

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Tổng tiền:</Typography>

                  <Typography {...TypoStyle}>
                    {formatPrice(bill.total_price, ' đồng') ?? 'Trống'}
                  </Typography>
                </Box>

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Khuyến mãi:</Typography>

                  <Typography {...TypoStyle}>
                    {(bill.total_discount == 0 ? '' : '-') +
                      formatPrice(bill.total_discount, ' đồng') ?? 'Trống'}
                  </Typography>
                </Box>

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Thành tiền:</Typography>

                  <Typography {...TypoStyle}>
                    {formatPrice(bill.final_price, ' đồng') ?? 'Trống'}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box component={'div'}>
              <Stack direction="column" spacing={1}>
                <Typography variant="button" fontWeight={'bold'}>
                  Thông tin vận chuyển
                </Typography>

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Người nhận:</Typography>

                  <Typography {...TypoStyle}>
                    {bill.deliveryTableRow?.name ?? 'Trống'}
                  </Typography>
                </Box>

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Số điện thoại:</Typography>

                  <Typography {...TypoStyle}>
                    {bill.deliveryTableRow?.tel ?? 'Trống'}
                  </Typography>
                </Box>

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Ngày đặt giao:</Typography>

                  <Typography {...TypoStyle}>
                    {formatDateString(
                      bill.deliveryTableRow?.ship_date,
                      'DD/MM/YYYY'
                    ) ?? 'Trống'}
                  </Typography>
                </Box>

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Thời gian đặt giao:</Typography>

                  <Typography {...TypoStyle}>
                    {bill.deliveryTableRow?.ship_time ?? 'Trống'}
                  </Typography>
                </Box>

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Địa chỉ giao hàng:</Typography>

                  <Typography {...TypoStyle} textAlign={'right'}>
                    {bill.deliveryTableRow?.addressObject?.address ??
                      bill.deliveryTableRow?.address ??
                      'Trống'}
                  </Typography>
                </Box>

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Ghi chú:</Typography>

                  <Typography {...TypoStyle} textAlign={'right'}>
                    {bill.deliveryTableRow?.delivery_note ?? 'Trống'}
                  </Typography>
                </Box>

                <Box component={'div'} sx={BoxStyle}>
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
              component={'div'}
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

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Tên khuyến mãi:</Typography>

                  <Typography {...TypoStyle}>
                    {bill.sale?.name ?? 'Trống'}
                  </Typography>
                </Box>

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Chương trình giảm giá:</Typography>

                  <Typography {...TypoStyle}>
                    {`Giảm ${bill.sale?.percent ?? 0}%, tối đa ${formatPrice(
                      bill.sale?.limit,
                      ' đồng'
                    )}` ?? 'Trống'}
                  </Typography>
                </Box>

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Mã code:</Typography>

                  <Typography
                    {...TypoStyle}
                    fontWeight={'bold'}
                    color={'error'}
                  >
                    {bill.sale?.code ?? 'Trống'}
                  </Typography>
                </Box>

                <Box component={'div'} sx={BoxStyle}>
                  <Typography {...TypoStyle}>Thời gian áp dụng:</Typography>

                  <Typography {...TypoStyle}>
                    {formatDateString(bill.sale?.start_at) +
                      ' - ' +
                      formatDateString(bill.sale?.end_at) ?? 'Trống'}
                  </Typography>
                </Box>

                <Box component={'div'} sx={BoxStyle}>
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
            {(!bill.booking_item_id || bill.booking_item_id == '') &&
              bill.billItems?.map((item, index) => (
                <BillItemsContent key={index} item={item} />
              ))}

            {bill.booking_item_id != '' && bill.bookingItem && (
              <BookingItemContent item={bill.bookingItem} />
            )}
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

  const [imageProduct, setImageProduct] = useState<string>('');
  useEffect(() => {
    async function getImage() {
      if (
        item.product &&
        item.product.images.length > 0 &&
        item.product.images[0] != ''
      ) {
        try {
          const image = await getDownloadUrlFromFirebaseStorage(
            item.product.images[0]
          );
          setImageProduct(image);
        } catch (error: any) {
          setImageProduct(promotionImage.src);
        }
      }
    }

    getImage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.product?.images[0]]);

  return (
    <>
      <Box
        component={'div'}
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
              src={imageProduct}
              sx={{
                objectFit: 'cover',
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

              <Box component={'div'} sx={BoxStyle}>
                <Typography {...TypoStyle}>Size:</Typography>

                <Typography {...TypoStyle}>
                  {SizeNameParse(item.variant?.size)}
                </Typography>
              </Box>

              <Box component={'div'} sx={BoxStyle}>
                <Typography {...TypoStyle}>Vật liệu:</Typography>

                <Typography {...TypoStyle}>{item.variant?.material}</Typography>
              </Box>

              <Box component={'div'} sx={BoxStyle}>
                <Typography {...TypoStyle}>Số lượng:</Typography>

                <Typography {...TypoStyle}>{item.amount ?? '0'}</Typography>
              </Box>

              <Box component={'div'} sx={BoxStyle}>
                <Typography {...TypoStyle}>Ngày sản xuất:</Typography>

                <Typography {...TypoStyle}>
                  {formatDateString(item.batch?.mfg) ?? 'Trống'}
                </Typography>
              </Box>

              <Box component={'div'} sx={BoxStyle}>
                <Typography {...TypoStyle}>Ngày hết hạn:</Typography>

                <Typography {...TypoStyle}>
                  {formatDateString(item.batch?.exp) ?? 'Trống'}
                </Typography>
              </Box>

              <Box component={'div'} sx={BoxStyle}>
                <Typography {...TypoStyle}>Giá bán:</Typography>

                <Typography {...TypoStyle}>
                  {formatPrice(item.price, ' đồng') + ' / sản phẩm' ?? 'Trống'}
                </Typography>
              </Box>

              <Box component={'div'} sx={BoxStyle}>
                <Typography {...TypoStyle}>Giảm giá:</Typography>

                <Typography {...TypoStyle}>
                  {` Giảm ${formatPrice(item.total_discount, ' đồng')} (${
                    item.discount
                  }%) / sản phẩm` ?? 'Trống'}
                </Typography>
              </Box>

              <Box component={'div'} sx={BoxStyle}>
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

export function BookingItemContent({ item }: { item: BookingItem }) {
  const [imageSrc, setImageSrc] = useState<string[]>([]);
  const [cakeBaseSrc, setCakeBaseSrc] = useState<string>('');

  useEffect(() => {
    async function getImage() {
      if (item.images && item.images.length > 0) {
        try {
          await Promise.all(
            item.images.map(
              async (image) => await getDownloadUrlFromFirebaseStorage(image)
            )
          ).then((images) => {
            setImageSrc(images);
          });
        } catch (error: any) {
          console.log(error);
        }
      }

      if (item.cakeBase && item.cakeBase.image != '') {
        try {
          const image = await getDownloadUrlFromFirebaseStorage(
            item.cakeBase.image
          );
          setCakeBaseSrc(image);
        } catch (error: any) {
          console.log(error);
        }
      }
    }
    getImage();
  }, [item]);

  return (
    <Box
      component={'div'}
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
      <Stack direction="column" spacing={1}>
        <Box
          component={'div'}
          sx={{ ...BoxStyle, display: 'flex', flexDirection: 'column', gap: 1 }}
        >
          <Typography
            {...TypoStyle}
            sx={{
              width: '100%',
            }}
          >
            Hình ảnh sản phẩm:
          </Typography>

          <Grid container spacing={2}>
            {imageSrc.map((image, index) => (
              <Grid item xs={4} key={index}>
                <Box component={'div'}>
                  <Box
                    component={'img'}
                    src={image}
                    alt={`Hình ${index + 1}`}
                    sx={{
                      width: '100%',
                      aspectRatio: '1 / 0.8',
                      objectFit: 'contain',
                      borderRadius: 4,
                      backgroundColor: 'grey.400',
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box component={'div'} sx={BoxStyle}>
          <Typography {...TypoStyle}>Nhân dịp:</Typography>

          <Typography {...TypoStyle}>
            {item.occasion == '' ? 'Trống' : item.occasion}
          </Typography>
        </Box>

        <Box component={'div'} sx={BoxStyle}>
          <Typography {...TypoStyle}>Size:</Typography>

          <Typography {...TypoStyle}>{SizeNameParse(item.size)}</Typography>
        </Box>

        <Box component={'div'} sx={BoxStyle}>
          <Typography {...TypoStyle}>Thông điệp:</Typography>

          <Typography {...TypoStyle}>
            {item.message.content == '' ? 'Trống' : item.message.content}
          </Typography>
        </Box>

        <Box component={'div'} sx={BoxStyle}>
          <Typography {...TypoStyle}>Ghi chú:</Typography>

          <Typography {...TypoStyle}>
            {item.note == '' ? 'Trống' : item.note}
          </Typography>
        </Box>

        <Box
          component={'div'}
          sx={{ ...BoxStyle, display: 'flex', flexDirection: 'column', gap: 1 }}
        >
          <Typography
            {...TypoStyle}
            sx={{
              width: '100%',
            }}
          >
            Cốt bánh:
          </Typography>

          <Grid container spacing={2} justifyContent={'center'}>
            <Grid item xs={5}>
              <Box
                component={'div'}
                sx={{
                  py: 1,
                  height: '100%',
                }}
              >
                <Box
                  component={'img'}
                  loading="lazy"
                  src={cakeBaseSrc}
                  alt={item.cakeBase?.name ?? 'Cốt bánh'}
                  sx={{
                    width: '100%',
                    aspectRatio: '1 / 0.5',
                    objectFit: 'cover',
                    borderRadius: 4,
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={true}>
              <Stack
                direction="column"
                spacing={1}
                sx={{
                  py: 1,
                }}
              >
                <Typography variant="body1">
                  {item.cakeBase?.name ?? 'Cốt bánh'}
                </Typography>
                <Typography {...TypoStyle}>
                  {item.cakeBase?.description}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </Box>
  );
}
