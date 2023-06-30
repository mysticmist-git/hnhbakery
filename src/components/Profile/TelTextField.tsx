import { InputAdornment, TextField, Typography, useTheme } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { CustomIconButton } from '../Inputs/Buttons';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useSnackbarService } from '@/lib/contexts';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import isVNPhoneNumber from '@/lib/utilities/checkVNNumberPhone';

export function TelTextField(props: any) {
  const theme = useTheme();
  const handleSnackbarAlert = useSnackbarService();

  const { textStyle, userData } = props;
  const telRef = useRef<HTMLInputElement>(null);
  const [editState, setEditState] = useState(false);

  useEffect(() => {
    if (telRef.current) {
      telRef.current.value = userData.tel;
    }
  }, [userData.tel]);

  const handleSave = () => {
    if (telRef.current) {
      if (!isVNPhoneNumber(telRef.current.value)) {
        handleSnackbarAlert('warning', 'Số điện thoại không hợp lệ');
        return;
      }
      if (telRef.current.value !== userData.tel) {
        handleSnackbarAlert('success', 'Thay đổi số điện thoại thành công!');
        // Hên: cập nhật thay đổi dô db phụ nha bà!
      }
      if (telRef.current.value === userData.tel) {
        handleSnackbarAlert('info', 'Không thay đổi!');
      }
    }
    setEditState(() => !editState);
  };
  const handleCancel = () => {
    handleSnackbarAlert('info', 'Hủy thay đổi thành công!');
    if (telRef.current) telRef.current.value = userData.tel;
    setEditState(() => !editState);
  };

  return (
    <>
      <TextField
        label="Số điện thoại"
        type="tel"
        inputRef={telRef}
        disabled={!editState}
        variant="outlined"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Typography variant="button" color={theme.palette.text.secondary}>
                +84
              </Typography>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {!editState && (
                <CustomIconButton
                  onClick={() => {
                    setEditState(() => !editState);
                  }}
                  sx={{
                    color: theme.palette.common.black,
                  }}
                >
                  <EditRoundedIcon fontSize="small" />
                </CustomIconButton>
              )}
              {editState && (
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
          style: {
            borderRadius: '8px',
          },
        }}
        inputProps={{
          sx: {
            ...textStyle,
          },
        }}
      />
    </>
  );
}
