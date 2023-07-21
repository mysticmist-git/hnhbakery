import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import { deleteDocFromFirestore, getCollection } from '@/lib/firestore';
import { FeedbackObject, SuperDetail_FeedbackObject } from '@/lib/models';
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

export default function ModalState({
  open,
  handleClose,
  feedbackState,
  setFeedbackState,
  handleFeedbackDataChange,
}: {
  open: boolean;
  handleClose: () => void;
  feedbackState: SuperDetail_FeedbackObject | null;
  setFeedbackState: React.Dispatch<
    React.SetStateAction<SuperDetail_FeedbackObject | null>
  >;
  handleFeedbackDataChange: any;
}) {
  const clearData = () => {
    setFeedbackState(() => null);
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
              Xác nhận xóa feedback?
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
                color={'error'}
                onClick={async () => {
                  if (feedbackState) {
                    try {
                      await deleteDocFromFirestore(
                        COLLECTION_NAME.FEEDBACKS,
                        feedbackState.id!
                      );
                      handleSnackbarAlert(
                        'success',
                        'Xóa feedback thành công!'
                      );
                      handleFeedbackDataChange(feedbackState);
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
