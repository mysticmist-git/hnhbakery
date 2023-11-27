import { CustomIconButton } from '@/components/buttons';
import { updateAddress, updateAddressValue } from '@/lib/DAO/addressDAO';
import { useSnackbarService } from '@/lib/contexts';
import Address from '@/models/address';
import { UserTableRow } from '@/models/user';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { InputAdornment, TextField, useTheme } from '@mui/material';
import React, { useEffect, useRef } from 'react';

export default function AddressItem({
  textStyle,
  value,
  index,
  disabled,
  editItem,
  handleSetEditItem,
  userData,
}: {
  textStyle: any;
  value: Address;
  index: number;
  disabled: boolean;
  editItem: { editState: boolean; index: number };
  handleSetEditItem: (editState: boolean, index: number) => void;
  userData: UserTableRow | undefined;
}) {
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
  }, [value]);

  //#endregion

  //#region Handlers

  const handleSave = async () => {
    console.log(addressRef.current);
    console.log(userData);

    if (addressRef.current && userData) {
      if (addressRef.current.value !== value.address) {
        try {
          if (!userData?.addresses) {
            return;
          }
          const addressIndex = userData.addresses.indexOf(value);
          const newAddresses = [...userData.addresses];

          newAddresses[addressIndex].address = addressRef.current!.value;

          await updateAddressValue(
            userData.group_id,
            userData.id,
            newAddresses[addressIndex].id,
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
  };

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
      <TextField
        label={'Địa chỉ ' + (index + 1)}
        disabled={disabled}
        variant="outlined"
        inputRef={addressRef}
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
        type="text"
      />
    </>
  );
}
