import {
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  DialogActions,
  Box,
  useTheme,
  alpha,
  Grid,
} from '@mui/material';
import { CustomTextField } from '../Inputs';
import { CustomButton } from '../Inputs/Buttons';
import bg from '../../assets/Decorate/bg10.png';
import vnpay from '../../assets/Decorate/vnpay.jpg';
import momo from '../../assets/Decorate/MOMO.jpg';
import Image from 'next/image';
import { useState } from 'react';
import CustomIconButton from '../Inputs/Buttons/customIconButton';
import CloseIcon from '@mui/icons-material/Close';

const PTTTs = [
  {
    name: 'VNPay',
    image: vnpay.src,
    href: '',
  },
  {
    name: 'MoMo',
    image: momo.src,
    href: '',
  },
];

function PTTT_item(props: any) {
  const theme = useTheme();
  const { item } = props;
  const { name, image, href } = item;

  const [isHover, setIsHover] = useState(false);
  return (
    <Box
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

export default function DialogHinhThucThanhToan(props: any) {
  const { open, handleClose } = props;
  const theme = useTheme();
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
            width: '50vw',
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
                <PTTT_item item={item} />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
