import { CustomIconButton } from '@/components/buttons';
import { db } from '@/firebase/config';
import { updateAddress } from '@/lib/DAO/addressDAO';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import Address from '@/models/address';
import { UserTableRow } from '@/models/user';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { InputAdornment, TextField, useTheme } from '@mui/material';
import { collection, doc, updateDoc } from 'firebase/firestore';
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
  const handleSnackbarAlert = useSnackbarService();
  const theme = useTheme();
  const addressRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (addressRef.current) {
      addressRef.current.value = value.address;
    }
  }, [value]);

  const handleSave = async () => {
    if (addressRef.current && userData) {
      if (addressRef.current.value !== value.address) {
        try {
          if (!userData?.addresses) {
            return;
          }
          const addressIndex = userData.addresses.indexOf(value);
          const newAddresses = [...userData.addresses];

          newAddresses[addressIndex].address = addressRef.current!.value;

          await updateAddress(
            userData.group_id,
            userData.id!,
            newAddresses[addressIndex].id,
            newAddresses[addressIndex]
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
      if (addressRef.current.value === value.address) {
        handleSnackbarAlert(
          'info',
          'Địa chỉ ' + (index + 1) + ' không thay đổi!'
        );
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
