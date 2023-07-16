import DoiMatKhau_Dialog from '@/components/Profile/DoiMatKhau_Dialog';
import { CustomIconButton } from '@/components/buttons';
import { EditRounded } from '@mui/icons-material';
import { InputAdornment, TextField, useTheme } from '@mui/material';
import React, { useState } from 'react';

function DoiMKTextField(props: any) {
  const theme = useTheme();
  const { textStyle, userData, user } = props;
  const [open, setOpen] = useState(false);

  const handleCloseDoiMatKhau = () => {
    setOpen(false);
  };

  return (
    <>
      <TextField
        label="Mật khẩu"
        disabled
        variant="outlined"
        value={userData.password ? userData.password : ''}
        fullWidth
        InputProps={{
          style: {
            borderRadius: '8px',
          },
          endAdornment: (
            <InputAdornment position="end">
              <CustomIconButton
                onClick={() => setOpen(true)}
                sx={{
                  color: theme.palette.common.black,
                }}
              >
                <EditRounded fontSize="small" />
              </CustomIconButton>
            </InputAdornment>
          ),
        }}
        inputProps={{
          sx: {
            ...textStyle,
          },
        }}
        type="password"
      />
      <DoiMatKhau_Dialog
        open={open}
        handleClose={handleCloseDoiMatKhau}
        textStyle={textStyle}
        user={user}
      />
    </>
  );
}

export default DoiMKTextField;
