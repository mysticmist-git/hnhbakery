import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import { deleteDocFromFirestore, getCollection } from '@/lib/firestore';
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
import { CustomIconButton } from '../../buttons';

import { deleteFeedback } from '@/lib/DAO/feedbackDAO';
import { BranchTableRow } from '@/models/branch';
import { updateBranch } from '@/lib/DAO/branchDAO';

export default function ModalState({
  open,
  handleClose,
  branchState,
  setBranchState,
  handleBranchDataChange,
}: {
  open: boolean;
  handleClose: () => void;
  branchState: BranchTableRow | null;
  setBranchState: React.Dispatch<React.SetStateAction<BranchTableRow | null>>;
  handleBranchDataChange: any;
}) {
  const clearData = () => {
    setBranchState(() => null);
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
              Xác nhận {branchState?.active ? 'vô hiệu' : 'kích hoạt'} chi
              nhánh?
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
                color={'error'}
                onClick={async () => {
                  if (branchState) {
                    try {
                      branchState.active = !branchState.active;
                      const { manager, ...data } = branchState;
                      await updateBranch(data.id, {
                        ...data,
                      });

                      if (branchState.active) {
                        handleSnackbarAlert(
                          'success',
                          'Kích hoạt chi nhánh thành công!'
                        );
                      } else {
                        handleSnackbarAlert(
                          'success',
                          'Vô hiệu chi nhánh thành công!'
                        );
                      }
                      handleBranchDataChange(branchState);
                    } catch (error: any) {
                      handleSnackbarAlert('error', error.message);
                    }
                    handleClose();
                  } else {
                    handleSnackbarAlert('error', 'Lỗi.');
                    handleClose();
                  }
                }}
              >
                Xác nhận
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      </>
    </>
  );
}
