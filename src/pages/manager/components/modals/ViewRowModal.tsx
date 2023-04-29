import theme from '@/styles/themes/lightTheme';
import { Close } from '@mui/icons-material';
import {
  Modal,
  Grid,
  Typography,
  Button,
  IconButton,
  Divider,
  Avatar,
  TextField,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Box } from '@mui/system';
import { DocumentData } from 'firebase/firestore';
import React from 'react';

export interface ViewModalProps {
  displayingData: DocumentData;
  setDisplayingData: any;
  open: boolean;
  onClose: () => void;
}

export default function ViewRowModal({
  displayingData,
  setDisplayingData,
  open,
  onClose,
}: ViewModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: '1rem',
          p: 4,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h5" fontWeight={'bold'}>
                Loại sản phẩm
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{
                    borderRadius: '1rem',
                    textTransform: 'none',
                  }}
                >
                  Cập nhật
                </Button>
                <IconButton onClick={onClose}>
                  <Close />
                </IconButton>
              </Box>
            </Box>
            <Divider
              sx={{
                mt: '1rem',
              }}
            />
          </Grid>
          <Grid item lg={6}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'right',
                flexDirection: 'column',
              }}
            >
              <Avatar
                src="https://images.immediate.co.uk/production/volatile/sites/30/2020/08/croissants_0-9efd0ea.jpg?quality=90&webp=true&resize=300,272"
                variant="rounded"
                sx={{
                  width: 'auto',
                  height: 'auto',
                }}
              />
              <Button
                variant="contained"
                sx={{
                  borderRadius: '0 0 0.4rem 0.4rem',
                  backgroundColor: theme.palette.secondary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.dark,
                  },
                  textTransform: 'none',
                }}
              >
                Tải ảnh lên
              </Button>
            </Box>
          </Grid>
          <Grid item lg={6}>
            <Box
              sx={{
                display: 'flex',
                gap: '1rem',
                flexDirection: 'column',
              }}
            >
              <TextField
                label="Tên loại sản phẩm"
                variant="standard"
                color="secondary"
                fullWidth
                value={displayingData?.name}
              />
              <TextField
                label="Miêu tả"
                variant="standard"
                color="secondary"
                multiline
                fullWidth
                value={displayingData?.description}
              />
              <FormControlLabel
                control={
                  <Switch
                    color="secondary"
                    checked={displayingData?.isActive}
                  />
                }
                label={
                  <Typography variant="body1" fontWeight="bold">
                    Còn hoạt động
                  </Typography>
                }
                labelPlacement="start"
                sx={{
                  alignSelf: 'end',
                }}
              />
            </Box>
          </Grid>
          <Grid xs={12}>
            <Divider
              sx={{
                my: '1rem',
              }}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'end',
                gap: '0.7rem',
              }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.secondary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.dark,
                  },
                  paddingX: '1.5rem',
                  borderRadius: '1rem',
                }}
                onClick={onClose}
              >
                Thoát
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
