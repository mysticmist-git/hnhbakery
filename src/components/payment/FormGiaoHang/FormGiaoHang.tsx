import CustomTextarea from '@/components/inputs/TextArea/CustomTextArea';
import CustomTextField from '@/components/inputs/textFields/CustomTextField';
import { getBranches } from '@/lib/DAO/branchDAO';
import { getProvinces } from '@/lib/DAO/provinceDAO';
import { DeliveryForm, SetDeliveryForm } from '@/lib/hooks/useDeliveryForm';
import Branch from '@/models/branch';
import Province from '@/models/province';
import { Check } from '@mui/icons-material';
import {
  Autocomplete,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { Box } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { FC, memo, useEffect, useMemo, useState } from 'react';
import { isImportSpecifier } from 'typescript';
import { useLocalStorage } from 'usehooks-ts';
import ChooseTime from '../ChooseTime';

type FormGiaoHangProps = {
  form: DeliveryForm;
  setForm: SetDeliveryForm;
};

type UserAddressResolverProps = {
  branchId: string;
  onBranchIdChange: (value: string) => void;
};

const UserAddressResolver: FC<UserAddressResolverProps> = ({
  branchId,
  onBranchIdChange,
}) => {
  //#region Hooks

  const theme = useTheme();

  //#endregion

  //#region UseStates

  const [isFirstTime, setIsFirstTime] = useState(true);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null
  );
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  //#endregion

  //#region Memos

  const availableProvinces = useMemo(() => {
    if (!branches || branches.length <= 0) return [];

    const branchProvinceIds = branches.map((b) => b.province_id);

    return provinces.filter((p) => branchProvinceIds.includes(p.id));
  }, [branches, provinces]);

  const filteredBranches = useMemo(() => {
    if (!branches || branches.length < 0) return [];
    if (!selectedProvince) return branches;

    return branches.filter((b) => b.province_id === selectedProvince?.id);
  }, [branches, selectedProvince]);

  //#endregion

  //#region UseEffects

  useEffect(() => {
    if (isFirstTime) {
      getProvinces()
        .then((provinces) => {
          setProvinces(provinces);

          getBranches()
            .then((branches) => {
              setBranches(branches);

              if (branchId) {
                const branch = branches.find((b) => b.id === branchId);
                if (branch) {
                  setSelectedBranch(branch);
                  const province = provinces.find((p) => p.id === branch?.id);
                  setSelectedProvince(province ?? null);
                } else {
                  setSelectedBranch(null);
                }
              }
            })
            .catch(() => setBranches([]));
        })
        .catch(() => setProvinces([]))
        .finally(() => setIsFirstTime(false));
    } else {
      if (branchId) {
        const branch = branches.find((b) => b.id === branchId);
        if (branch) {
          setSelectedBranch(branch);
          onBranchIdChange(branch.id);
          const province = provinces.find((p) => p.id === branch?.id);
          setSelectedProvince(province ?? null);
        } else {
          setSelectedBranch(null);
        }
      }
    }
  }, [branches, isFirstTime, onBranchIdChange, provinces]);

  //#endregion

  //#region Handlers

  const handleSelectBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    onBranchIdChange(branch.id);
  };

  //#endregion

  return (
    <>
      <Autocomplete
        value={selectedProvince}
        onChange={(e, value) => setSelectedProvince(value)}
        disablePortal
        options={availableProvinces}
        getOptionLabel={(p) => p.name}
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tỉnh thành"
            inputProps={{
              ...params.inputProps,
            }}
          />
        )}
      />

      <Divider sx={{ mt: 1 }} />

      {filteredBranches && filteredBranches.length > 0 ? (
        <Stack gap={1} marginTop={2}>
          {filteredBranches.map((b, i) => (
            <Box
              key={i}
              component="button"
              onClick={(e) => {
                e.preventDefault();
                handleSelectBranch(b);
              }}
              sx={{
                backgroundColor: 'white',
                borderWidth: 3,
                borderStyle: 'solid',
                borderColor: 'secondary.main',
                borderRadius: 2,
                padding: 2,
                py: 1,
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                  cursor: 'pointer',
                },
                transition: 'all 0.2 ease-in-out',
              }}
            >
              <Stack
                direction="row"
                justifyContent={'space-between'}
                alignItems={'center'}
              >
                <Stack alignItems="start">
                  <Stack>
                    <Stack direction="row" alignItems={'center'} gap={1}>
                      <Typography>Chi nhánh:</Typography>
                      <Typography variant="body2">{b.name}</Typography>
                    </Stack>
                  </Stack>
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontStyle: 'italic',
                      fontWeight: 'regular',
                      color: 'grey.600',
                    }}
                  >
                    {b.address}
                  </Typography>
                </Stack>
                <Check
                  color="secondary"
                  sx={
                    selectedBranch?.id !== b.id ? { visibility: 'hidden' } : {}
                  }
                />
              </Stack>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography>Hiện không có chi nhánh khả dụng nào!</Typography>
      )}
    </>
  );
};

function FormGiaoHang({ form, setForm }: FormGiaoHangProps) {
  const theme = useTheme();

  const [] = useLocalStorage('email', '');

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
                  value={form.customerName}
                  onChange={(e: any) =>
                    setForm('CUSTOMER_NAME', e.target.value)
                  }
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
                  onChange={(e: any) => setForm('TEL', e.target.value)}
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
                    setForm('EMAIL', e.target.value);

                    // TODO: This is some disgusting ugly workaround
                    // I'm just using local storage there
                    // I'm sorry
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
                <UserAddressResolver
                  branchId={form.branchId}
                  onBranchIdChange={(id) => setForm('BRANCH_ID', id)}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  placeholder="Địa chỉ"
                  fullWidth
                  required
                  value={form.address}
                  onChange={(e: any) => setForm('ADDRESS', e.target.value)}
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
                          value={dayjs(form.deliveryDate)}
                          disablePast
                          format="DD/MM/YYYY"
                          onChange={(value) =>
                            setForm(
                              'DELIVERY_DATE',
                              value?.toDate() ?? new Date()
                            )
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
                            setForm('DELIVERY_TIME', value)
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
                        onChange={(e) => setForm('NOTE', e.target.value)}
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
    </>
  );
}

export default memo(FormGiaoHang);
