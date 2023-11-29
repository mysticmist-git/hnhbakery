import { CustomIconButton } from '@/components/buttons';
import { getUser, updateUser } from '@/lib/DAO/userDAO';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import { getCollection, updateDocToFirestore } from '@/lib/firestore';
import { UserTableRow } from '@/models/user';
// import { SuperDetail_UserObject, UserObject } from '@/lib/models';
import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import React from 'react';

export default function ModalState({
  open,
  handleClose,
  userState,
  setUserState,
  handleUserDataChange,
}: {
  open: boolean;
  handleClose: () => void;
  userState: UserTableRow | null;
  setUserState: React.Dispatch<React.SetStateAction<UserTableRow | null>>;
  handleUserDataChange: (value: UserTableRow) => void;
}) {
  const clearData = () => {
    setUserState(() => null);
  };

  const localHandleClose = () => {
    // Clear data
    clearData();
    handleClose();
  };

  const handleSnackbarAlert = useSnackbarService();
  const theme = useTheme();
  return (
    <>
      <Dialog
        open={open}
        onClose={localHandleClose}
        fullWidth
        maxWidth="xs"
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.5),
          '& .MuiDialog-paper': {
            backgroundColor: theme.palette.common.white,
            borderRadius: '8px',
          },
          transition: 'all 0.5s ease-in-out',
        }}
      >
        <DialogTitle>
          <Box component={'div'}>
            <CustomIconButton
              onClick={handleClose}
              sx={{ position: 'absolute', top: '8px', right: '8px' }}
            >
              <Close />
            </CustomIconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography
            align="center"
            variant="body1"
            sx={{
              fontWeight: 'bold',
              px: 4,
            }}
            color={theme.palette.common.black}
          >
            {userState?.active
              ? 'Xác nhận vô hiệu tài khoản?'
              : 'Xác nhận kích hoạt tài khoản?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Box
            component={'div'}
            sx={{
              display: 'flex',
              gap: 1,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              color: theme.palette.text.secondary,
            }}
          >
            <Button
              variant="contained"
              color="inherit"
              onClick={() => {
                handleClose();
              }}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              color={userState?.active ? 'error' : 'success'}
              onClick={async () => {
                const data = await getUser(userState!.group_id, userState!.id);
                if (data) {
                  data.active = !data.active;
                  userState!.active = data.active;
                  await updateUser(userState!.group_id, userState!.id, data);
                  if (data.active) {
                    handleSnackbarAlert(
                      'success',
                      'Kích hoạt tài khoản thành công!'
                    );
                  } else {
                    handleSnackbarAlert('success', 'Vô hiệu khoản thành công!');
                  }
                  handleUserDataChange({
                    ...userState!,
                  });
                  handleClose();
                } else {
                  handleSnackbarAlert('error', 'Lỗi.');
                  handleClose();
                }
              }}
            >
              {userState?.active ? 'Vô hiệu' : 'Kích hoạt'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
