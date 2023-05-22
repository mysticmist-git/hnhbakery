import { Grid, Typography, useTheme, alpha } from '@mui/material';
import { Box } from '@mui/system';
import CustomTextField from '@/components/Inputs/CustomTextField';
import { ChooseTime } from './ChooseTime';
import { CustomTextarea } from '@/components/Inputs/CustomTextarea';
import { useEffect, useState } from 'react';

export default function FormGiaoHang(props: any) {
  const { MocGioGiaoHang, handleSetPhiVanChuyen } = props;

  const [diaChi, setDiaChi] = useState('');
  const [thoiGianGiao, setThoiGianGiao] = useState(MocGioGiaoHang[0].value);
  const [ngayGiao, setNgayGiao] = useState('');

  useEffect(() => {
    console.log(diaChi, thoiGianGiao, ngayGiao);

    if (diaChi !== '' && thoiGianGiao !== '' && ngayGiao !== '') {
      handleSetPhiVanChuyen(100000);
      // tôi muốn kiểu có 1 cái api tính khoảng cách từ địa chỉ nhập đến trường UIT và cho ra phí vận chuyển!
    } else {
      handleSetPhiVanChuyen(0);
    }
  }, [diaChi, thoiGianGiao, ngayGiao]);

  const theme = useTheme();

  return (
    <>
      <Box component="form" noValidate onSubmit={() => {}}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="start"
          spacing={{ xs: 1, md: 2 }}
        >
          <Grid item xs={12} md={6}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="start"
              spacing={1}
            >
              <Grid item xs={12}>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color={theme.palette.secondary.main}
                >
                  Thông tin người nhận
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  placeholder="Tên người nhận"
                  fullWidth
                  required
                  type="text"
                  autoComplete="name"
                  name="name"
                  id="name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  placeholder="Số điện thoại"
                  fullWidth
                  required
                  type="tel"
                  autoComplete="tel"
                  name="tel"
                  id="tel"
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <CustomTextField
                  placeholder="Email"
                  fullWidth
                  required
                  type="email"
                  autoComplete="email"
                  name="email"
                  id="email"
                />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  placeholder="Địa chỉ"
                  fullWidth
                  required
                  value={diaChi}
                  onChange={(e: any) => setDiaChi(e.target.value)}
                  type="text"
                  autoComplete="street-address"
                  name="streetAddress"
                  id="streetAddress"
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} display={{ md: 'none', xs: 'block' }}>
            <Box
              sx={{
                borderTop: 1.5,
                borderColor: theme.palette.text.secondary,
                my: 1,
              }}
            ></Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid
              container
              direction="row"
              spacing={1}
              justifyContent={'center'}
              alignItems={'start'}
            >
              <Grid item xs={6}>
                <Grid
                  container
                  direction="row"
                  spacing={1}
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                  <Grid item xs={12}>
                    <Grid
                      container
                      direction="row"
                      spacing={1}
                      justifyContent={'center'}
                      alignItems={'center'}
                    >
                      <Grid item xs={12}>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color={theme.palette.secondary.main}
                        >
                          Ngày giao
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <CustomTextField
                          required
                          value={ngayGiao}
                          onChange={(e: any) => setNgayGiao(e.target.value)}
                          fullWidth
                          type="date"
                          name="date"
                          id="date"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid
                      container
                      direction="row"
                      spacing={1}
                      justifyContent={'center'}
                      alignItems={'center'}
                    >
                      <Grid item xs={12}>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color={theme.palette.secondary.main}
                        >
                          Thời gian giao
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <ChooseTime
                          required
                          thoiGianGiao={thoiGianGiao}
                          handleSetThoiGianGiao={(value: string) =>
                            setThoiGianGiao(value)
                          }
                          options={MocGioGiaoHang}
                          fullWidth
                          select
                          type="text"
                          name="time"
                          id="time"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid
                  container
                  direction="row"
                  spacing={1}
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                  <Grid item xs={12}>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color={theme.palette.secondary.main}
                    >
                      Ghi chú giao hàng
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        border: 3,
                        borderColor: theme.palette.secondary.main,
                        borderRadius: '8px',
                        overflow: 'hidden',
                        bgcolor: theme.palette.common.white,
                        '&:hover': {
                          boxShadow: `0px 0px 5px 2px ${alpha(
                            theme.palette.secondary.main,
                            0.3,
                          )}`,
                        },
                      }}
                    >
                      <CustomTextarea
                        name="email"
                        id="email"
                        minRows={3}
                        style={{
                          minHeight: '44px',
                        }}
                        placeholder="Ghi chú cho shipper bên mình"
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
