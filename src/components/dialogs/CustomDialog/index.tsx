import { CustomIconButton } from '@/components/buttons';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import React from 'react';

export default function CustomDialog(props: any) {
  const { handleClose, open, title } = props;
  const theme = useTheme();

  return (
    <>
      <Dialog
        disableEscapeKeyDown
        open={open}
        onClose={handleClose}
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, 0.5),
          '& .MuiDialog-paper': {
            backgroundColor: theme.palette.common.white,
            borderRadius: '8px',
            width: props.width ?? { md: '50vw', xs: '85vw' },
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
              px: 3,
            }}
            color={theme.palette.common.black}
          >
            {title}
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
        <DialogContent>{props.children}</DialogContent>
      </Dialog>
    </>
  );
}
