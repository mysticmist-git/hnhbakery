import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import { getCollection, updateDocToFirestore } from '@/lib/firestore';
import { SaleObject, SuperDetail_SaleObject } from '@/lib/models';
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
import { CustomIconButton } from '../buttons';

export function ModalState({
  open,
  handleClose,
  saleState,
  setSaleState,
}: {
  open: boolean;
  handleClose: () => void;
  saleState: SuperDetail_SaleObject | null;
  setSaleState: React.Dispatch<
    React.SetStateAction<SuperDetail_SaleObject | null>
  >;
}) {
  const clearData = () => {
    setSaleState(() => null);
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
            Xác nhận hủy khuyến mãi?
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
                const data = (
                  await getCollection<SaleObject>(COLLECTION_NAME.SALES)
                ).find((sale) => sale.id === saleState?.id);
                if (data) {
                  data.isActive = !data.isActive;
                  await updateDocToFirestore(data, COLLECTION_NAME.SALES);
                  handleSnackbarAlert('success', 'Hủy khuyến mãi thành công!');
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
  );
}
