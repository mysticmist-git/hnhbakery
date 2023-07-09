import CustomTextarea from '@/components/Inputs/TextArea/CustomTextArea';
import CustomTextField from '@/components/Inputs/textFields/CustomTextField';
import { OtherInfos, Ref } from '@/lib/contexts/payment';
import { Grid, Typography, alpha, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import {
  ForwardedRef,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import ChooseTime from '../ChooseTime';

const FormGiaoHang = forwardRef<Ref, any>(
  (
    props: any,
    ref: ForwardedRef<{
      getOtherInfos: () => OtherInfos;
    }>
  ) => {
    const { MocGioGiaoHang, handleSetPhiVanChuyen } = props;

    const [diaChi, setDiaChi] = useState('');
    const [thoiGianGiao, setThoiGianGiao] = useState(MocGioGiaoHang[0].value);
    const [ngayGiao, setNgayGiao] = useState<Date>(new Date());

    // #region refs

    const nameRef = useRef<HTMLInputElement>(null);
    const telRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const deliveryNoteRef = useRef<HTMLTextAreaElement>(null);

    // endregion

    useEffect(() => {
      console.log(diaChi, thoiGianGiao, ngayGiao);

      if (diaChi !== '' && thoiGianGiao !== '' && ngayGiao) {
        console.log('set phi van chuyen');
        handleSetPhiVanChuyen(100000);
        // tôi muốn kiểu có 1 cái api tính khoảng cách từ địa chỉ nhập đến trường UIT và cho ra phí vận chuyển!
      } else {
        handleSetPhiVanChuyen(0);
      }
    }, [diaChi, thoiGianGiao, ngayGiao]);

    useImperativeHandle(
      ref,
      () => {
        return {
          getOtherInfos() {
            return {
              name: nameRef.current?.value,
              tel: telRef.current?.value,
              email: emailRef.current?.value,
              deliveryNote: deliveryNoteRef.current?.value,
              diaChi,
              thoiGianGiao,
              ngayGiao,
            } as OtherInfos;
          },
        };
      },
      [diaChi, thoiGianGiao, ngayGiao]
    );

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
                    ref={nameRef}
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
                    ref={telRef}
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
                    ref={emailRef}
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
                          <DatePicker
                            value={dayjs(ngayGiao)}
                            disablePast
                            format="DD/MM/YYYY"
                            onChange={(value) =>
                              setNgayGiao(() => value?.toDate() ?? new Date())
                            }
                            sx={{
                              border: (theme) =>
                                `3px solid ${theme.palette.secondary.main}`,
                              borderRadius: '8px',
                            }}
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
                              0.3
                            )}`,
                          },
                        }}
                      >
                        <CustomTextarea
                          ref={deliveryNoteRef}
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
);

export default memo(FormGiaoHang);
