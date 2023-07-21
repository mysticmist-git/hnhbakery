import ImageBackground from '@/components/Imagebackground/Imagebackground';
import CustomTextField from '@/components/Inputs/textFields/CustomTextField/CustomTextField';
import { ListBillItem, ListProductItem } from '@/components/Search';
import CustomAccordionFrame from '@/components/accordions/CustomAccordionFrame';
import { CustomButton } from '@/components/buttons';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import { SearchContext } from '@/lib/contexts/search';
import { getDocFromFirestore } from '@/lib/firestore';
import { createSearchResult } from '@/lib/pageSpecific/search';
import { BillInfor, ProductInfor } from '@/lib/types/search';
import { Box, Grid, Link, Skeleton, Typography, useTheme } from '@mui/material';
import { FirebaseError } from 'firebase/app';
import React, { createContext, memo, useState } from 'react';

const MSG_NOTIFY_EMPTY_SEARCH_TEXT =
  'Vui lòng nhập mã đơn hàng để tiến hành tìm kiếm';

const Search = () => {
  //#region Hooks

  const theme = useTheme();
  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  //#region States

  const [billInforState, setBillInforState] = useState<BillInfor | null>(null);
  const [productInforState, setProductInforState] = useState<ProductInfor[]>(
    []
  );
  const [searchText, setSearchText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  //#endregion

  // #region scroll

  const handleClick = () => {
    const top: number = 280;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  //#endregion

  //#region Handlers

  const withLoading = <TArgs extends any[], TResult>(
    fn: (...args: TArgs) => TResult
  ) => {
    return async (...args: TArgs) => {
      setLoading(true);
      await fn(...args);
      setLoading(false);
    };
  };

  const handleProceedSearch: React.MouseEventHandler<
    HTMLAnchorElement
  > = async (event: React.MouseEvent<HTMLAnchorElement>): Promise<void> => {
    console.log('Function running...');
    if (searchText === '') {
      handleSnackbarAlert('error', MSG_NOTIFY_EMPTY_SEARCH_TEXT);
      return;
    }

    const billId = searchText;

    try {
      const { billInfor, productInfors } = await createSearchResult(billId);

      console.log(billInfor);
      console.log(productInfors);

      setBillInforState(billInfor);
      setProductInforState(productInfors);
    } catch (error: any) {
      const message = 'Không tìm thấy đơn hàng';
      handleSnackbarAlert('error', message);
    }
  };

  //#endregion

  console.log(loading);

  return (
    <SearchContext.Provider
      value={{
        billInfor: billInforState,
        productInfor: productInforState,
      }}
    >
      <Box>
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
                  Tìm kiếm
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </ImageBackground>

        <Box
          sx={{
            pt: 6,
            pb: 12,
            px: { xs: 2, sm: 2, md: 4, lg: 8 },
            overflow: 'visible',
          }}
        >
          <Typography
            align="center"
            variant="h1"
            color={theme.palette.secondary.main}
            overflow={'visible'}
            sx={{
              pt: 1.5,
            }}
          >
            Tìm kiếm và tra cứu
          </Typography>
          <Typography
            align="center"
            variant="body2"
            color={theme.palette.common.black}
          >
            Tìm kiếm hóa đơn, theo dõi đơn hàng, …
          </Typography>
          <Grid
            sx={{
              pt: 4,
            }}
            container
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            spacing={1}
          >
            <Grid item xs={true}>
              <CustomTextField
                value={searchText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchText(e.target.value)
                }
                onClick={handleClick}
                fullWidth
                placeholder="Mã hóa đơn, chính sách đổi trả, chính sách bảo mật, điều khoản dịch vụ,..."
                type="text"
              />
            </Grid>
            <Grid item>
              <CustomButton
                sx={{ height: '100%', borderRadius: '8px', py: 1.5, px: 3 }}
                onClick={withLoading(handleProceedSearch)}
              >
                <Typography variant="button">Tìm kiếm</Typography>
              </CustomButton>
            </Grid>
          </Grid>
          <Grid
            sx={{
              pt: 4,
            }}
            container
            direction={'row'}
            justifyContent={'center'}
            alignItems={'start'}
            spacing={4}
          >
            {billInforState && !loading && (
              <>
                <Grid item md={4} xs={12}>
                  <CustomAccordionFrame
                    heading="Hóa đơn của bạn"
                    children={ListBillItem}
                  />
                </Grid>
                <Grid item md={8} xs={12}>
                  <CustomAccordionFrame
                    heading="Danh sách sản phẩm"
                    children={ListProductItem}
                  />
                </Grid>
              </>
            )}
            {loading && (
              <Grid item xs={12}>
                <Skeleton variant="rounded" height={120} animation="wave" />
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </SearchContext.Provider>
  );
};

export default memo(Search);
