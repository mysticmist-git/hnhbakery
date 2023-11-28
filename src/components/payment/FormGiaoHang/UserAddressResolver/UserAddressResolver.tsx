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
  selectedProvinceId: string;
  branchId: string;
  branches: Branch[];
  onBranchIdChange: (value: string) => void;
};

const UserAddressResolver: FC<UserAddressResolverProps> = ({
  selectedProvinceId,
  branchId,
  branches,
  onBranchIdChange,
}) => {
  console.log(selectedProvinceId, branchId, branches);

  //#region Handlers

  const handleSelectBranch = (branch: Branch) => {
    onBranchIdChange(branch.id);
  };

  //#endregion

  //#region Memos

  const filteredBranches = useMemo(() => {
    if (!branches || branches.length < 0) return [];
    if (!selectedProvinceId) return branches;

    return branches.filter((b) => b.province_id === selectedProvinceId);
  }, [branches, selectedProvinceId]);

  //#endregion

  return (
    <>
      {filteredBranches && filteredBranches.length > 0 ? (
        <Stack gap={1}>
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
                    !branchId || branchId !== b.id
                      ? { visibility: 'hidden' }
                      : {}
                  }
                />
              </Stack>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography>Không có chi nhánh khả dụng nào phù hợp!</Typography>
      )}
    </>
  );
};

export default UserAddressResolver;
