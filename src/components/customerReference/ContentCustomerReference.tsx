import {
  Box,
  Button,
  InputAdornment,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import bg9 from '@/assets/Decorate/bg9.png';
import cake7 from '@/assets/Decorate/cake7.jpg';
import Sale, { InitSale } from '@/models/sale';
import { CustomIconButton } from '../buttons';
import { useSnackbarService } from '@/lib/contexts';
import { ContentCopyRounded } from '@mui/icons-material';
import { KhaoSatLoaiSanPham } from './KhaoSatLoaiSanPham';
import CustomerReference from '@/models/CustomerReference';
import KhaoSatGiaTien from './KhaoSatGiaTien';
import KhaoSatSize from './KhaoSatSize';
import KhaoSatColor from './KhaoSatColor';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';
import {
  createCustomerReference,
  getCustomerReference,
  updateCustomerReference,
} from '@/lib/DAO/customerReferenceDAO';
import { useRouter } from 'next/router';

export function ContentCustomerReference() {
  const handleSnackbarAlert = useSnackbarService();

  const [customerReferenceData, setCustomerReferenceData] =
    useState<CustomerReference>({
      uid: '',
      productTypeIds: [],
      colors: [],
      sizes: [],
      prices: {
        min: 20000,
        max: 500000,
      },
    });

  const handleChangeData = useCallback(
    (key: keyof CustomerReference, value: any) => {
      setCustomerReferenceData((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const [user, userLoading, userError] = useAuthState(auth);
  const router = useRouter();

  const handleSubmit = useCallback(async () => {
    if (!user) {
      return;
    }
    const { sizes, productTypeIds, prices, colors } = customerReferenceData;
    if (productTypeIds.length == 0) {
      handleSnackbarAlert('warning', 'Bạn chưa trả lời câu số 1!');
      return;
    }
    if (sizes.length == 0) {
      handleSnackbarAlert('warning', 'Bạn chưa trả lời câu số 3!');
      return;
    }
    if (colors.length == 0) {
      handleSnackbarAlert('warning', 'Bạn chưa trả lời câu số 4!');
      return;
    }

    try {
      const data = await getCustomerReference(user.uid);
      if (data) {
        await updateCustomerReference(user.uid, {
          ...data,
          ...customerReferenceData,
        });
      } else {
        await createCustomerReference({
          ...customerReferenceData,
          uid: user.uid,
        });
      }
      handleSnackbarAlert('success', 'Tham gia khảo sát thành công!');
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  }, [customerReferenceData, user]);

  console.log(customerReferenceData);

  useEffect(() => {
    async function getData() {
      if (!user) {
        handleSnackbarAlert(
          'warning',
          'Vui lòng đăng nhập trước khi thực hiện khảo sát!'
        );
        router.push('/auth/login');
        return;
      }
      try {
        const data = await getCustomerReference(user.uid);
        if (data) {
          setCustomerReferenceData(data);
        } else {
          setCustomerReferenceData({
            uid: user.uid,
            productTypeIds: [],
            colors: [],
            sizes: [],
            prices: {
              min: 20000,
              max: 500000,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    getData();
  }, [user]);

  // Sale
  const [saleNewFriend, setSaleNewFriend] = useState<Sale | undefined>({
    ...InitSale(),
    code: 'newfriend',
    id: 'newfriend',
  });

  // Stepper
  const khaosatStepper = [
    {
      label: 'Hãy chọn những loại bánh bạn thích!',
      content: (
        <>
          <KhaoSatLoaiSanPham
            customerReferenceData={customerReferenceData}
            handleChangeData={handleChangeData}
          />
        </>
      ),
    },
    {
      label: 'Bạn sẵn sàng chi bao nhiêu cho các sản phẩm bánh?',
      content: (
        <>
          <KhaoSatGiaTien
            customerReferenceData={customerReferenceData}
            handleChangeData={handleChangeData}
          />
        </>
      ),
    },
    {
      label:
        'Theo bạn trong một lần thưởng thức khẩu phần bánh nào là phù hợp?',
      content: (
        <>
          <KhaoSatSize
            customerReferenceData={customerReferenceData}
            handleChangeData={handleChangeData}
          />
        </>
      ),
    },
    {
      label: 'Trong các lựa chọn sau bánh nào thu hút bạn nhất?',
      content: (
        <>
          <KhaoSatColor
            customerReferenceData={customerReferenceData}
            handleChangeData={handleChangeData}
          />
        </>
      ),
    },
  ];

  return (
    <Stack
      direction={'column'}
      justifyContent={'flex-start'}
      alignItems={'center'}
      sx={{
        minHeight: '650px',
        width: '100%',
        zIndex: 2,
      }}
    >
      {/* head */}
      <Stack
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        sx={{
          width: '100%',
          backgroundImage: `url(${cake7.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Stack
          direction={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          sx={{
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.4)',
            p: 10,
          }}
        >
          <Typography sx={{ color: 'white' }} variant="h3" align="center">
            H&H Bakery
          </Typography>

          <Typography sx={{ color: 'white' }} variant="h2" align="center">
            Khảo sát người dùng
          </Typography>
        </Stack>
      </Stack>

      {/* body */}
      <Stack direction={'column'} sx={{ width: '100%', flexGrow: 1, p: 4 }}>
        <Stepper orientation="vertical">
          {khaosatStepper.map((step, index) => (
            <Step active key={step.label}>
              <StepLabel
                icon={
                  <Box
                    component={'div'}
                    sx={{
                      bgcolor: 'secondary.main',
                      color: 'white',
                      borderRadius: '50%',
                      height: '26px',
                      aspectRatio: '1',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {index + 1}
                  </Box>
                }
              >
                <Typography
                  variant="body2"
                  sx={{
                    bgcolor: 'secondary.main',
                    color: 'white',
                    p: 0.7,
                    px: 2,
                    borderRadius: '100px',
                    boxShadow: 3,
                  }}
                >
                  {step.label}
                </Typography>
              </StepLabel>
              <StepContent>
                <Box
                  component={'div'}
                  sx={{
                    bgcolor: 'white',
                    p: 2,
                    mr: -1,
                    borderRadius: '16px',
                    border: 2,
                    borderColor: 'secondary.main',
                  }}
                >
                  {step.content}
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Stack>

      {/* footer */}
      <Stack direction={'column'} sx={{ width: '100%' }}>
        <Box
          component={'div'}
          sx={{
            width: '100%',
            height: '80px',
            backgroundImage: `url(${bg9.src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        />
        <Stack
          direction={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          spacing={2}
          sx={{
            width: '100%',
            backgroundColor: 'secondary.dark',
            p: 4,
          }}
        >
          <Typography sx={{ color: 'white' }} variant="h2" align="center">
            Cảm ơn bạn đã thực hiện khảo sát!
          </Typography>
          <Typography sx={{ color: 'white' }} variant="h3" align="center">
            Tặng bạn mã giảm giá 50.000 đồng
          </Typography>
          <TextField
            variant="outlined"
            value={saleNewFriend?.id ?? 'Trống'}
            size="small"
            sx={{
              '& fieldset': {
                border: 'none',
              },
            }}
            InputProps={{
              readOnly: true,
              sx: {
                pointerEvents: 'auto',
                borderRadius: '8px',
                backgroundColor: 'white',
                width: 'fit-content',
                fontSize: 'body2.fontSize',
                color: 'text.secondary',
                boxShadow: 0,
              },
              endAdornment: saleNewFriend?.id && (
                <InputAdornment position="end">
                  <CustomIconButton
                    edge="end"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        saleNewFriend?.id ?? 'Trống'
                      );
                      handleSnackbarAlert(
                        'success',
                        'Đã sao chép mã khuyến mãi vào clipboard!'
                      );
                    }}
                  >
                    <Tooltip title="Sao chép mã vào clipboard">
                      <ContentCopyRounded fontSize="small" />
                    </Tooltip>
                  </CustomIconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            onClick={handleSubmit}
            variant="contained"
            color="secondary"
            sx={{ color: 'white', borderRadius: '24px', px: 4 }}
          >
            Nộp khảo sát và quay về trang chủ
          </Button>

          <Box component={'div'} sx={{ width: '100%', height: '80px' }} />
        </Stack>
      </Stack>
    </Stack>
  );
}
