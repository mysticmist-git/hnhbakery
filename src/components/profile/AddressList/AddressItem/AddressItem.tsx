import { CustomIconButton } from '@/components/buttons';
import { updateAddress, updateAddressValue } from '@/lib/DAO/addressDAO';
import { useSnackbarService } from '@/lib/contexts';
import Address from '@/models/address';
import Province from '@/models/province';
import { UserTableRow } from '@/models/user';
import { Close, Edit, Save } from '@mui/icons-material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  useTheme,
} from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';

type AddressItemProps = {
  textStyle: any;
  value: Address;
  index: number;
  disabled: boolean;
  editItem: { editState: boolean; index: number };
  handleSetEditItem: (editState: boolean, index: number) => void;
  userData: UserTableRow | undefined;
  provinces: Province[];
};

export default function AddressItem({
  textStyle,
  value,
  index,
  disabled,
  editItem,
  handleSetEditItem,
  userData,
  provinces,
}: AddressItemProps) {
  //#region States

  const [selectedProvince, setSelectedProvince] = useState<Province | null>(
    null
  );

  //#endregion

  //#region Hooks

  const handleSnackbarAlert = useSnackbarService();
  const theme = useTheme();

  //#endregion

  //#region Refs

  const addressRef = useRef<HTMLInputElement>(null);

  //#endregion

  //#region UseEffects

  useEffect(() => {
    if (addressRef.current) {
      addressRef.current.value = value.address;
    }

    setSelectedProvince(
      provinces.find((province) => province.id === value.province_id) ?? null
    );
  }, [provinces, value]);

  //#endregion

  //#region Handlers

  const handleSave = useCallback(async () => {
    console.log('run');

    if (!selectedProvince) {
      handleSnackbarAlert('warning', 'Vui lòng chọn tỉnh thành!');
      console.log('Selected province is null!');
      return;
    }

    console.log(selectedProvince.id);
    console.log(value.province_id);

    if (addressRef.current && userData) {
      if (
        addressRef.current.value !== value.address ||
        selectedProvince.id !== value.province_id
      ) {
        try {
          if (!userData?.addresses) {
            return;
          }
          const addressIndex = userData.addresses.indexOf(value);
          const newAddresses = [...userData.addresses];

          newAddresses[addressIndex].address = addressRef.current!.value;

          console.log(selectedProvince);

          await updateAddressValue(
            userData.group_id,
            userData.id,
            newAddresses[addressIndex].id,
            selectedProvince.id,
            addressRef.current!.value
          );

          handleSnackbarAlert(
            'success',
            'Thay đổi địa chỉ ' + (index + 1) + ' thành công!'
          );
          // Hên: cập nhật thay đổi dô db phụ nha bà!
          // Có userData
        } catch (error) {
          console.log(error);
          handleSnackbarAlert(
            'error',
            'Thay đổi địa chỉ ' + (index + 1) + ' thất bại!'
          );
        }
      }
    }

    handleSetEditItem(false, -1);
  }, [
    handleSetEditItem,
    handleSnackbarAlert,
    index,
    selectedProvince,
    userData,
    value,
  ]);

  const handleCancel = () => {
    handleSnackbarAlert(
      'info',
      'Hủy thay đổi địa chỉ ' + (index + 1) + ' thành công!'
    );
    if (addressRef.current) addressRef.current.value = value.address;
    handleSetEditItem(false, -1);
  };

  //#endregion

  return (
    <>
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
            color="secondary"
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
      <TextField
        label={'Địa chỉ ' + (index + 1)}
        disabled={disabled}
        variant="outlined"
        inputRef={addressRef}
        color="secondary"
        fullWidth
        InputProps={{
          style: {
            borderRadius: '8px',
          },
          endAdornment: (
            <InputAdornment position="end">
              {!editItem.editState && (
                <CustomIconButton
                  onClick={async () => {
                    handleSetEditItem(true, index);
                  }}
                  sx={{
                    color: theme.palette.common.black,
                  }}
                >
                  <EditRoundedIcon fontSize="small" />
                </CustomIconButton>
              )}
              {editItem.editState && editItem.index === index && (
                <>
                  <CustomIconButton
                    onClick={handleCancel}
                    sx={{
                      color: theme.palette.secondary.main,
                    }}
                  >
                    <CloseRoundedIcon fontSize="medium" />
                  </CustomIconButton>
                  <CustomIconButton
                    onClick={handleSave}
                    sx={{
                      color: theme.palette.success.main,
                    }}
                  >
                    <CheckRoundedIcon fontSize="medium" />
                  </CustomIconButton>
                </>
              )}
            </InputAdornment>
          ),
        }}
        inputProps={{
          sx: {
            ...textStyle,
          },
        }}
        type="address"
      />
    </>
  );
}
