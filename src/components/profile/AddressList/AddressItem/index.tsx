import { CustomIconButton } from '@/components/buttons';
import { useSnackbarService } from '@/lib/contexts';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { InputAdornment, TextField, useTheme } from '@mui/material';
import React, { useEffect, useRef } from 'react';

export function AddressItem(props: any) {
  const {
    textStyle,
    value,
    index,
    disabled,
    editItem,
    handleSetEditItem,
    userData,
  } = props;
  const theme = useTheme();

  const handleSnackbarAlert = useSnackbarService();
  const addressRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (addressRef.current) {
      addressRef.current.value = value;
    }
  }, [value]);

  const handleSave = () => {
    if (addressRef.current) {
      if (addressRef.current.value !== value) {
        handleSnackbarAlert(
          'success',
          'Thay đổi địa chỉ ' + (index + 1) + ' thành công!'
        );
        // Hên: cập nhật thay đổi dô db phụ nha bà!
        // Có userData
      }
      if (addressRef.current.value === value) {
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
    if (addressRef.current) addressRef.current.value = value;
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
                  onClick={() => handleSetEditItem(true, index)}
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
