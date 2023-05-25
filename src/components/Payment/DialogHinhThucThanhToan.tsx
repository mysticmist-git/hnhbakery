import {
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  Box,
  useTheme,
  alpha,
  Grid,
  Button,
} from '@mui/material';
import bg from '../../assets/Decorate/bg10.png';
import vnpay from '../../assets/Decorate/vnpay.jpg';
import momo from '../../assets/Decorate/MOMO.jpg';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import CustomIconButton from '../Inputs/Buttons/customIconButton';
import CloseIcon from '@mui/icons-material/Close';
import { PaymentObject } from '@/lib/models/Payment';
import Link from 'next/link';
import { getCollection } from '@/lib/firestore/firestoreLib';

interface Props {
  billId: string;
  totalPrice: number;
  paymentDescription: string;
}

function PTTT_item({ item, onClick }: { item: any; onClick: () => void }) {
  const theme = useTheme();
  const { name, image } = item;

  const [isHover, setIsHover] = useState(false);

  return (
    <Box
      component={Button}
      onClick={() => onClick()}
      sx={{
        width: '100%',
        height: '25vh',
        overflow: 'hidden',
        borderRadius: '8px',
        position: 'relative',
        cursor: 'pointer',
      }}
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
    >
      <Box
        component={Image}
        fill={true}
        src={image}
        alt={name}
        sx={{
          objectFit: 'cover',
          transition: 'all 0.3s ease-in-out',
          transform: isHover ? 'scale(1.3)' : 'scale(1)',
          rotate: isHover ? '5deg' : '0deg',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: alpha(theme.palette.common.black, 0.7),
          opacity: isHover ? 1 : 0,
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Typography variant="h2" color={theme.palette.common.white}>
          {name}
        </Typography>
      </Box>
    </Box>
  );
}

export default function DialogHinhThucThanhToan({
  open,
  handleClose,
  handlePayment,
}: {
  open: boolean;
  handleClose: any;
  handlePayment: (type: string | undefined) => void;
}) {
  // #region Hooks

  const theme = useTheme();

  // #endregion

  // #region States

  const [PTTTs, setPTTTs] = useState<PaymentObject>([]);

  // #endregion

  useEffect(() => {
    const getPayments = async () => {
      const payments = await getCollection<PaymentObject>('payments');

      // TODO: WTF is this code?
      for (const pttt of payments) {
        if (pttt.name === 'VNPay') {
          pttt.image = vnpay.src;
        } else if (pttt.name === 'Momo') {
          pttt.image = momo.src;
        }
      }

      setPTTTs(() => [...payments]);
    };

    getPayments();
  }, []);

  return (
    <>
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
          >
            {PTTTs.map((item: PaymentObject, index: number) => (
              <Grid item key={index} xs={12}>
                <PTTT_item
                  item={item}
                  onClick={() => handlePayment(item.name)}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
