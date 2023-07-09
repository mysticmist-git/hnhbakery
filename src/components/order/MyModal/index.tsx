import { CustomIconButton } from '@/components/buttons';
import { useSnackbarService } from '@/lib/contexts';
import { updateDocToFirestore } from '@/lib/firestore';
import { AssembledBillDetail, CustomBill } from '@/lib/models';
import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import { Box, alpha } from '@mui/system';
import { memo, useState } from 'react';

const modalStyle = {
  // These 4 below are positionings I used for larger
  // height viewports - centered
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // other styles...
  width: 1000,
  bgcolor: 'background.paper',
  borderRadius: '1rem',
  boxShadow: 24,
  p: 4,
  marginTop: '2rem',
  // media query @ the max height you want (my case is the
  // height of the viewport before the cutoff phenomenon) -
  // set the top to '0' and translate the previous 'y'
  // positioning coordinate so the top of the modal is @ the
  // top of the viewport
  '@media(max-height: 890px)': {
    top: '0',
    transform: 'translate(-50%, 0%)',
  },
};

const MyModal = ({
  open,
  bill,
  handleClose,
  handleBillDataChange,
}: {
  open: boolean;
  bill: CustomBill | null;
  handleClose: () => void;
  handleBillDataChange: (newBill: CustomBill) => void;
}) => {
  //#region Hooks

  const handleSnackbarAlert = useSnackbarService();

  //#endregion

  //#region States

  const [billDetails, setBillDetails] = useState<AssembledBillDetail | null>(
    null
  );
  const [billState, setBillState] = useState<number>(0);

  //#endregion

  //#region UseEffects

  // useEffect(() => {
  //   const getData = async (bill: CustomBill) => {
  //     const billDetails = await getCollectionWithQuery<BillDetailObject>(
  //       'bill_details',
  //       where('bill_id', '==', bill.id)
  //     );

  //     const assembledBillDetails = await Promise.all(
  //       billDetails.map(async (detail) => {
  //         const batch = (await getDocFromFirestore(
  //           'batches',
  //           detail.batch_id!
  //         )) as BatchObject;

  //         const product = (await getDocFromFirestore(
  //           'products',
  //           batch.product_id
  //         )) as ProductObject;

  //         const productType = (await getDocFromFirestore(
  //           'productTypes',
  //           product.productType_id
  //         )) as ProductTypeObject;

  //         return {
  //           ...detail,
  //           productName: product.name,
  //           productTypeName: productType.name,
  //           material: batch.material,
  //           size: batch.size,
  //         };
  //       })
  //     );

  //     setBillDetails(() => assembledBillDetails);
  //   };

  //   if (!bill) {
  //     handleSnackbarAlert('error', 'Đã có lỗi xảy ra');
  //     handleClose();
  //     return;
  //   }

  //   setBillState(() => bill.state ?? 0);
  //   getData(bill);
  // }, [bill]);

  //#endregion

  // #region Methods

  const clearData = () => {
    setBillDetails(() => null);
    setBillState(() => 0);
  };

  // #endregion

  //#region Handlers

  const handleBillStateChange = (state: number) => {
    setBillState(() => state);
  };

  const handleSave = () => {
    const data = {
      ...bill,
      state: billState,
    } as CustomBill;

    updateDocToFirestore(data, 'bills');

    handleSnackbarAlert('success', 'Đã cập nhật đơn hàng');

    handleBillDataChange(data);
  };

  const localHandleClose = () => {
    // Clear data
    clearData();
    handleClose();
  };

  //#endregion

  const theme = useTheme();

  return (
    <>
      <Dialog
        open={open}
        onClose={localHandleClose}
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.5),
          '& .MuiDialog-paper': {
            backgroundColor: theme.palette.common.white,
            borderRadius: '8px',
            width: { md: '50vw', xs: '85vw' },
          },
          transition: 'all 0.5s ease-in-out',
        }}
      >
        <DialogTitle>
          <Typography
            align="center"
            variant="body1"
            sx={{
              fontWeight: 'bold',
            }}
            color={theme.palette.common.black}
          >
            Chọn phương thức thanh toán
          </Typography>

          <Box>
            <CustomIconButton
              onClick={handleClose}
              sx={{ position: 'absolute', top: '8px', right: '8px' }}
            >
              <CloseIcon />
            </CustomIconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          ></Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default memo(MyModal);
