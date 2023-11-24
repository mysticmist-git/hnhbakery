import { getBranches } from '@/lib/DAO/branchDAO';
import { getProvinces } from '@/lib/DAO/provinceDAO';
import Branch from '@/models/branch';
import Province from '@/models/province';
import { Check } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Divider,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { FC, useEffect, useMemo, useState } from 'react';

export type UserAddressResolverProps = {
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
    async function getData() {
      try {
        const [provinces, branches] = await Promise.all([
          await getProvinces(),
          await getBranches(),
        ]);

        setProvinces(provinces);
        setBranches(branches);
      } catch (error) {}
    }

    console.log('run');
    getData();
  }, []);

  useEffect(() => {
    const branch = branches.find((b) => b.id === branchId);
    if (branch) {
      setSelectedBranch(branch);
      onBranchIdChange(branch.id);
      const province = provinces.find((p) => p.id === branch?.id);
      setSelectedProvince(province ?? null);
    } else {
      setSelectedBranch(null);
    }
  }, [branchId, branches, onBranchIdChange, provinces]);

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
        options={[null, ...availableProvinces]}
        getOptionLabel={(p) => p?.name ?? 'Tất cả'}
        sx={{ width: '100%' }}
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
                border: 3,
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
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'grey.800',
                        }}
                      >
                        Chi nhánh:
                      </Typography>
                      <Typography variant="body2" fontWeight={'bold'}>
                        {b.name}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'light',
                      color: 'grey.800',
                      textAlign: 'start',
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

export default UserAddressResolver;
