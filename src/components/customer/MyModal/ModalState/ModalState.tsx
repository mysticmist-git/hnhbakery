import { CustomIconButton } from '@/components/buttons';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import { getCollection, updateDocToFirestore } from '@/lib/firestore';
import { SuperDetail_UserObject, UserObject } from '@/lib/models';
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
  userState: SuperDetail_UserObject | null;
  setUserState: React.Dispatch<
    React.SetStateAction<SuperDetail_UserObject | null>
  >;
  handleUserDataChange: (value: SuperDetail_UserObject) => void;
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
          <Box>
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
            {userState?.isActive
              ? 'Xác nhận vô hiệu tài khoản?'
              : 'Xác nhận kích hoạt tài khoản?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Box
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
              color={userState?.isActive ? 'error' : 'success'}
              onClick={async () => {
                const data = (
                  await getCollection<UserObject>(COLLECTION_NAME.USERS)
                ).find((user) => user.id === userState?.id);
                if (data) {
                  data.isActive = !data.isActive;
                  await updateDocToFirestore(data, COLLECTION_NAME.USERS);
                  if (data.isActive) {
                    handleSnackbarAlert(
                      'success',
                      'Kích hoạt tài khoản thành công!'
                    );
                  } else {
                    handleSnackbarAlert('success', 'Vô hiệu khoản thành công!');
                  }
                  handleUserDataChange({
                    ...userState,
                    ...data,
                  });
                  handleClose();
                } else {
                  handleSnackbarAlert('error', 'Lỗi.');
                  handleClose();
                }
              }}
            >
              {userState?.isActive ? 'Vô hiệu' : 'Kích hoạt'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
}
