import { CustomIconButton } from '@/components/buttons';
import DoiMatKhau_Dialog from '@/components/profile/DoiMatKhau_Dialog';
import User, { UserTableRow } from '@/models/user';
import { EditRounded } from '@mui/icons-material';
import { InputAdornment, TextField, useTheme } from '@mui/material';
import { User as FirebaseUser } from 'firebase/auth';
import React, { useState } from 'react';

function DoiMKTextField({
  textStyle,
  user,
  userData,
  onUpdateUserData,
}: {
  textStyle: any;
  user: FirebaseUser;
  userData: UserTableRow;
  onUpdateUserData: (field: keyof User, value: User[keyof User]) => void;
}) {
  const theme = useTheme();
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
        value={'Không biết lấy mật khẩu'}
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
