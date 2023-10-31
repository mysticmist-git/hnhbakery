import bg from '@/assets/Decorate/bg10.png';
import momo from '@/assets/Decorate/momo.jpg';
import tienmat from '@/assets/Decorate/tienmat.jpg';
import vnpay from '@/assets/Decorate/vnpay.jpg';

import { CustomIconButton } from '@/components/buttons';
import { getPaymentMethods } from '@/lib/DAO/paymentMethodDAO';
import useDownloadUrl from '@/lib/hooks/useDownloadUrl';
import { PaymentObject } from '@/lib/models';
import PaymentMethod from '@/models/paymentMethod';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Props {
  billId: string;
  totalPrice: number;
  paymentDescription: string;
}

function PTTT_item({
  item,
  onClick,
}: {
  item: PaymentMethod;
  onClick: () => void;
}) {
  const theme = useTheme();
  const { name, image } = item;

  const [isHover, setIsHover] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const url = useDownloadUrl(image);
  console.log(image, url);

  return (
    <Box
      component={Button}
      onClick={() => onClick()}
      sx={{
        width: '100%',
        height: '30vh',
        overflow: 'hidden',
        borderRadius: '8px',
        position: 'relative',
        cursor: 'pointer',
        borderColor: theme.palette.secondary.main,
        border: 3,
      }}
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
    >
      <Box
        component={Image}
        fill={true}
        src={url}
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
  handlePayment: (id: string | undefined, type: string | undefined) => void;
}) {
  // #region Hooks

  const theme = useTheme();

  // #endregion

  // #region States

  const [PTTTs, setPTTTs] = useState<PaymentMethod[]>([]);

  // #endregion

  useEffect(() => {
    const getPayments = async () => {
      const payments = await getPaymentMethods();

      setPTTTs(payments);
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
            {PTTTs.map((item, index) => (
              <Grid item key={index} xs={12}>
                <PTTT_item
                  item={item}
                  onClick={() => handlePayment(item.id, item.name)}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
