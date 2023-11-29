import bg from '@/assets/Decorate/bg10.png';

import { CustomIconButton } from '@/components/buttons';
import { getPaymentMethods } from '@/lib/DAO/paymentMethodDAO';
import PaymentMethod from '@/models/paymentMethod';
import { Close } from '@mui/icons-material';
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
import { FC, useEffect, useState } from 'react';
import PTTT_item from './PTTT_item';

interface Props {
  billId: string;
  totalPrice: number;
  paymentDescription: string;
}

type DialogHinhThucThanhToanProps = {
  open: boolean;
  handleClose: any;
  handlePayment: (id: string | undefined, type: string | undefined) => void;
};

const DialogHinhThucThanhToan: FC<DialogHinhThucThanhToanProps> = ({
  open,
  handleClose,
  handlePayment,
}) => {
  // #region Hooks

  const theme = useTheme();

  // #endregion

  // #region States

  const [PTTTs, setPTTTs] = useState<PaymentMethod[]>([]);

  // #endregion

  //#region UseEffect

  useEffect(() => {
    const getPayments = async () => {
      const payments = await getPaymentMethods();

      setPTTTs(payments);
    };
    getPayments();
  }, []);

  //#endregion

  return (
    <Dialog
      disableEscapeKeyDown
      open={open}
      onClose={handleClose}
      sx={{
        backgroundImage: `url(${bg.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: alpha(theme.palette.primary.main, 0.5),
        backdropFilter: 'blur(7px)',
        '& .MuiDialog-paper': {
          backgroundColor: theme.palette.common.white,
          borderRadius: '8px',
          minWidth: '70vw',
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
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          {PTTTs.map((item, index) => (
            <Grid item key={index} xs={4}>
              <PTTT_item
                item={item}
                onClick={() => handlePayment(item.id, item.name)}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default DialogHinhThucThanhToan;
