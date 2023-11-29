import CustomTextarea from '@/components/inputs/TextArea/CustomTextArea';
import CustomTextField from '@/components/inputs/textFields/CustomTextField';
import { auth } from '@/firebase/config';
import { getAddresses } from '@/lib/DAO/addressDAO';
import { getBranches } from '@/lib/DAO/branchDAO';
import { GUEST_ID } from '@/lib/DAO/groupDAO';
import { getGuestUser, getUserByUid } from '@/lib/DAO/userDAO';
import { DeliveryForm, SetDeliveryForm } from '@/lib/hooks/useDeliveryForm';
import useProvinces from '@/lib/hooks/useProvinces';
import Address from '@/models/address';
import Branch from '@/models/branch';
import User from '@/models/user';
import { Check } from '@mui/icons-material';
import {
  Autocomplete,
  Divider,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { Box } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { onAuthStateChanged } from 'firebase/auth';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import ChooseTime from '../ChooseTime';
import UserAddressResolver from './UserAddressResolver';

type FormGiaoHangProps = {
  form: DeliveryForm;
  setForm: SetDeliveryForm;
};

function FormGiaoHang({ form, setForm }: FormGiaoHangProps) {
  //#region Hooks

  const theme = useTheme();
  const [_, setEmail] = useLocalStorage('email', '');
  const provinces = useProvinces();

  //#endregio
  //#region States

  const [isGuest, setIsGuest] = useState(true);
  const [userData, setUserData] = useState<User | null>(null);
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [selectedUserAddressIndex, setSelectedUserAddressIndex] =
    useState<number>(0);

  const [isUsingUserAddress, setIsUsingUserAddress] = useState(true);

  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState('');

  //#endregio
  //#region Memos

  const availableProvinces = useMemo(() => {
    if (!branches || branches.length <= 0) return [];

    const branchProvinceIds = branches.map((b) => b.province_id);

    return provinces.filter((p) => branchProvinceIds.includes(p.id));
  }, [branches, provinces]);

  //#endregio
  //#region UseEffects

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserByUid(user.uid).then((user) => setUserData(user ?? null));
      } else {
        getGuestUser().then((user) => setUserData(user ?? null));
      }
    });

    async function getData() {
      setBranches(await getBranches());
    }

    getData();

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function getData() {
      if (!userData) {
        setUserAddresses([]);
        return;
      }

      let isGuest = userData.id === GUEST_ID;
      setIsGuest(isGuest);

      if (isGuest) {
        setUserAddresses([]);
      } else {
        const addresses = await getAddresses(userData.group_id, userData.id);
        setUserAddresses(addresses);
        setForm('customerName', userData.name);
        setForm('tel', userData.tel);
        setForm('email', userData.mail);

        if (addresses.length > 0) {
          setSelectedUserAddressIndex(0);
        }
      }
    }

    getData();
  }, [setForm, userData]);

  useEffect(() => {
    if (!isUsingUserAddress) {
      setForm('address', '');
    }

    setForm('branchId', '');
  }, [isUsingUserAddress, selectedUserAddressIndex, setForm]);

  useEffect(() => {
    if (!isUsingUserAddress) return;

    setForm('address', userAddresses[selectedUserAddressIndex]?.address ?? '');
  }, [isUsingUserAddress, selectedUserAddressIndex, setForm, userAddresses]);

  useEffect(() => {
    if (isGuest) {
      setIsUsingUserAddress(false);
    }
  }, [isGuest]);

  //#endregio
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

              <FormControlLabel
                control={
                  <Switch
                    checked={isUsingUserAddress}
                    onChange={(_, checked) => setIsUsingUserAddress(checked)}
                    color="secondary"
                  />
                }
                label="Sử dụng địa chỉ đã lưu"
                sx={isGuest ? { display: 'none' } : {}}
              />
            </Grid>

            {isUsingUserAddress ? (
              <Grid item xs={12}>
                <Typography fontSize={16}>Chọn địa chỉ của bạn:</Typography>

                {userAddresses && userAddresses.length > 0 ? (
                  <List>
                    {userAddresses.map((address, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemButton
                          selected={selectedUserAddressIndex === index}
                          onClick={() => setSelectedUserAddressIndex(index)}
                          sx={{
                            border: (theme) =>
                              `3px solid ${theme.palette.secondary.main}`,
                            borderRadius: '8px',
                          }}
                        >
                          <ListItemText
                            primary={address.address}
                            secondary={
                              provinces.find(
                                (p) => p.id === address.province_id
                              )?.name ?? 'Không tìm thấy'
                            }
                          />
                          <ListItemIcon
                            sx={{
                              visibility:
                                selectedUserAddressIndex === index
                                  ? 'visible'
                                  : 'hidden',
                            }}
                          >
                            <Check color="secondary" />
                          </ListItemIcon>
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography
                    fontSize={16}
                    fontStyle={'italic'}
                    fontWeight={'regular'}
                  >
                    Bạn chưa lưu địa chỉ nào!
                  </Typography>
                )}

                <Divider sx={{ mt: 1 }} />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Typography fontSize={16}>Nhập địa chỉ:</Typography>

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
                  disabled={isUsingUserAddress}
                />

                <Divider sx={{ mt: 1 }} />
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography fontSize={16}>
                Chọn chi nhánh H&H Bakery khả dụng:
              </Typography>

              <Autocomplete
                disabled={isUsingUserAddress}
                value={provinces.find((p) => p.id === selectedProvinceId)}
                onChange={(e, value) => setSelectedProvinceId(value?.id ?? '')}
                options={[null, ...availableProvinces]}
                getOptionLabel={(p) => p?.name ?? 'Tất cả'}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                sx={[
                  { width: '100%', mb: 1 },
                  isUsingUserAddress ? { display: 'none' } : {},
                ]}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    size="small"
                    placeholder="Tỉnh thành"
                    InputProps={{
                      ...params.InputProps,
                      sx: {
                        border: 3,
                        borderColor: theme.palette.secondary.main,
                        borderRadius: 2,
                        overflow: 'hidden',
                      },
                    }}
                    inputProps={{
                      ...params.inputProps,
                      style: {
                        ...params.inputProps?.style,
                        border: '0px solid transparent',
                        fontSize: theme.typography.body2.fontSize,
                      },
                    }}
                  />
                )}
              />

              <Divider
                sx={[{ my: 1 }, isUsingUserAddress ? { display: 'none' } : {}]}
              />

              <UserAddressResolver
                selectedProvinceId={
                  isUsingUserAddress
                    ? userAddresses[selectedUserAddressIndex]?.province_id ?? 0
                    : selectedProvinceId
                }
                branchId={form.branchId}
                branches={branches}
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

export default FormGiaoHang;
