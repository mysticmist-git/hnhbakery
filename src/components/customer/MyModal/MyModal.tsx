import { SuperDetail_UserObject } from '@/lib/models';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSnackbarService } from '@/lib/contexts';
import { CustomIconButton } from '@/components/buttons';
import { Close } from '@mui/icons-material';
import { FeedBack_Content } from './FeedBack_Content';
import { HoaDon_Content } from './HoaDon_Content';
import { ThongTin_Content } from './ThongTin_Content';

export function MyModal({
  open,
  handleClose,
  user,
  handleUserDataChange,
}: {
  open: boolean;
  handleClose: () => void;
  user: SuperDetail_UserObject | null;
  handleUserDataChange: (newUser: SuperDetail_UserObject) => void;
}) {
  const handleSnackbarAlert = useSnackbarService();
  const theme = useTheme();
  const StyleCuaCaiBox = {
    width: '100%',
    height: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    border: 1,
    borderColor: theme.palette.text.secondary,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'center',
    opacity: 0.8,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      opacity: 1,
      boxShadow: 10,
    },
  };
  const textStyle = {
    fontSize: theme.typography.body2.fontSize,
    color: theme.palette.common.black,
    fontWeight: theme.typography.body2.fontWeight,
    fontFamily: theme.typography.body2.fontFamily,
  };
  const [modalUser, setModalUser] = useState<SuperDetail_UserObject | null>(
    user
  );

  useEffect(() => {
    setModalUser(() => user);
  }, [user]);

  //#region hàm
  const clearData = () => {
    setModalUser(() => null);
    // setEditMode(() => false);
    // setEditContent(() => null);
  };
  const localHandleClose = () => {
    // Clear data
    clearData();
    handleClose();
  };
  //#endregion

  return (
    <>
      <Dialog
        open={open}
        onClose={localHandleClose}
        fullWidth
        maxWidth="lg"
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.5),
          '& .MuiDialog-paper': {
            backgroundColor: theme.palette.common.white,
            borderRadius: '8px',
          },
          transition: 'all 0.5s ease-in-out',
        }}
      >
        <DialogTitle sx={{ boxShadow: 3 }}>
          <Typography
            align="center"
            variant="body1"
            sx={{
              fontWeight: 'bold',
            }}
            color={theme.palette.common.black}
          >
            Chi tiết khách hàng
          </Typography>

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
          <Box sx={{ py: 2 }}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              {/* Thông tin cá nhân */}
              <Grid item xs={12} alignSelf={'stretch'}>
                <Box sx={StyleCuaCaiBox}>
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      height: '40px',
                      p: 2,
                      bgcolor: theme.palette.text.secondary,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color={theme.palette.common.white}
                    >
                      Thông tin cá nhân
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: '100%',
                      p: 2,
                    }}
                  >
                    <ThongTin_Content
                      textStyle={textStyle}
                      modalUser={modalUser}
                    />
                  </Box>
                </Box>
              </Grid>

              {/* Danh sách hóa đơn */}
              <Grid item xs={12} alignSelf={'stretch'}>
                <Box sx={StyleCuaCaiBox}>
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      height: '40px',
                      p: 2,
                      bgcolor: theme.palette.text.secondary,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color={theme.palette.common.white}
                    >
                      Danh sách hóa đơn
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      p: 2,
                    }}
                  >
                    <HoaDon_Content
                      textStyle={textStyle}
                      modalUser={modalUser}
                    />
                  </Box>
                </Box>
              </Grid>

              {/* Danh sách feedback */}
              <Grid item xs={12} alignSelf={'stretch'}>
                <Box sx={StyleCuaCaiBox}>
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      height: '40px',
                      p: 2,
                      bgcolor: theme.palette.text.secondary,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color={theme.palette.common.white}
                    >
                      Danh sách phản hồi
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      p: 2,
                    }}
                  >
                    <FeedBack_Content
                      textStyle={textStyle}
                      modalUser={modalUser}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
