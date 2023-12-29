import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Stack,
  Typography,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';
import cake8 from '@/assets/Decorate/cake8.jpg';
import { useRouter } from 'next/router';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

function KhuyenNghiSanPhamDialog({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const router = useRouter();
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      slotProps={{
        backdrop: {
          sx: {
            background: 'rgba(0,0,0,0.7)',
          },
        },
      }}
      PaperProps={{
        sx: {
          bgcolor: 'primary.main',
          borderRadius: '24px',
          minWidth: '600px',
        },
      }}
    >
      <Stack direction={'row'} alignItems={'stretch'} sx={{ width: '100%' }}>
        <Box
          component={'img'}
          src={cake8.src}
          sx={{
            width: '40%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />

        <Stack
          direction={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          sx={{ width: '60%', minHeight: '100%', p: 4 }}
        >
          <Typography
            sx={{ color: 'secondary.main', width: '100%' }}
            variant="h2"
            align="center"
          >
            Thực hiện khảo sát
          </Typography>

          <Stack
            direction={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            spacing={2}
            sx={{ width: '100%' }}
          >
            <Stack
              direction={'row'}
              alignItems={'center'}
              justifyContent={'center'}
              sx={{
                bgcolor: 'secondary.main',
                color: 'white',
                p: 0.5,
                px: 2,
                borderRadius: '100px',
              }}
            >
              <Typography
                sx={{ color: 'inherit', width: '100%' }}
                variant="body2"
                align="center"
              >
                Nhận ngay mã giảm giá 50k
              </Typography>
            </Stack>
            <Typography
              sx={{ color: 'black', width: '100%' }}
              variant="body2"
              align="center"
            >
              Bài khảo sát nhằm mục đích cải thiện khả năng gợi ý sản phẩm phù
              hợp nhất cho khác hàng.
            </Typography>
          </Stack>

          <Button
            onClick={() => {
              router.push('/customer-reference');
            }}
            variant="contained"
            color="secondary"
            sx={{
              color: 'white',
              borderRadius: '24px',
              width: '100%',
              mt: 3,
              boxShadow: 3,
            }}
          >
            THAM GIA
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default KhuyenNghiSanPhamDialog;
