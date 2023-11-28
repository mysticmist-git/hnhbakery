import CustomTextarea from '@/components/inputs/TextArea/CustomTextArea';
import CustomTextField from '@/components/inputs/textFields/CustomTextField';
import { getAddresses } from '@/lib/DAO/addressDAO';
import useProvinces from '@/lib/hooks/useProvinces';
import useUserData from '@/lib/hooks/userUserData';
import {
  Autocomplete,
  Divider,
  Grid,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { Box } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { Address } from 'nodemailer/lib/mailer';
import { useCallback, useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import ChooseTime from '../ChooseTime';
import { FormGiaoHangProps } from './FormGiaoHang';
import UserAddressResolver from './UserAddressResolver';

export function FormGiaoHang({ form, setForm }: FormGiaoHangProps) {
  //#region Hooks
  const theme = useTheme();
  const [_, setEmail] = useLocalStorage('email', '');
  const provinces = useProvinces();
  const userData = useUserData();

  //#endregion
  //#region States
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);

  //#endregion
  //#region UseEffects
  useEffect(() => {
    async function getData() {
      try {
        await getAddresses(userdata);
      } finally {
      }
    }

    getDataGridUtilityClass();
  }, []);

  //#endregion
  //#region Handlers
  const handleBranchIdChange = useCallback(
    function (branchId) {
      setForm('branchId', branchId);
    },
    [setForm]
  );

  //#endregion
  return (
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
                value={form.customerName}
                onChange={(e: any) => setForm('customerName', e.target.value)}
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
                value={form.tel}
                onChange={(e: any) => setForm('tel', e.target.value)}
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
                value={form.email}
                onChange={(e: any) => {
                  setForm('email', e.target.value);
                  setEmail(e.target.value);
                }}
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
              <Divider
                sx={{
                  height: 4,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="body1"
                fontWeight="bold"
                color={theme.palette.secondary.main}
              >
                Địa chỉ nhận bánh
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                placeholder="Địa chỉ"
                fullWidth
                required
                value={form.address}
                onChange={(e: any) => setForm('address', e.target.value)}
                type="text"
                autoComplete="street-address"
                name="streetAddress"
                id="streetAddress"
              />

              <Autocomplete
                disablePortal
                value={selectedProvince}
                options={provinces}
                getOptionLabel={(o) => o.name}
                onChange={(_, value) => setSelectedProvince(value)}
                disabled={disabled}
                sx={{ width: 300, mr: 2 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tỉnh thành"
                    InputProps={{
                      ...params.InputProps,
                      sx: {
                        ...textStyle,
                        borderRadius: '8px',
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <UserAddressResolver
                branchId={form.branchId}
                onBranchIdChange={handleBranchIdChange}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} display={{ md: 'none', xs: 'block' }}>
          <Box
            component="div"
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
                        value={dayjs(form.deliveryDate)}
                        disablePast
                        format="DD/MM/YYYY"
                        onChange={(value) =>
                          setForm('deliveryDate', value?.toDate() ?? new Date())
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
                        thoiGianGiao={form.deliveryTime}
                        handleSetThoiGianGiao={(value: string) =>
                          setForm('deliveryTime', value)
                        }
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
                    component="div"
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
                      value={form.note}
                      onChange={(e) => setForm('note', e.target.value)}
                      name="note"
                      id="note"
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
  );
}
