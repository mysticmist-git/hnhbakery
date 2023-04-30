import theme from '@/styles/themes/lightTheme';
import { Close, Image } from '@mui/icons-material';
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
import React, { useEffect, useRef, useState } from 'react';
import { ViewModalProps } from './ViewRowModal';

export default function NewRowModal({
  displayingData,
  setDisplayingData,
  open,
  onClose,
}: ViewModalProps) {
  const [featuredImageFile, setFeaturedImageFile] = useState<any>(null);
  const [featuredImageURL, setFeaturedImageURL] = useState<string>('');

  const uploadInputRef = useRef<HTMLInputElement>(null);

  // console.log(featuredImageFile);

  useEffect(() => {
    if (featuredImageFile) {
      setFeaturedImageURL(URL.createObjectURL(featuredImageFile));
    }
  }, [featuredImageFile]);

  const handleUploadImage = (event: any) => {
    const file = event.target.files[0];

    setFeaturedImageFile(file);
  };

  const handleModalClose = () => {
    // Clear images data
    setFeaturedImageFile(null);
    setFeaturedImageURL('');

    // Close
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
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
                Thêm loại sản phẩm mới
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <IconButton onClick={handleModalClose}>
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
          <Grid
            item
            lg={6}
            sx={{
              display: 'flex',
              justifyContent: 'start',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            {/* <Avatar
              src={
                displayingData?.image &&
                displayingData.image !== '' &&
                displayingData.image
              }
              variant="square"
              sx={{ width: '100%', height: 240 }}
            >
              {(!displayingData?.image || displayingData?.image === '') && (
                <Image />
              )}
            </Avatar> */}
            <Avatar
              src={featuredImageURL}
              variant="square"
              sx={{ width: '100%', height: 240 }}
            >
              {(!featuredImageURL || featuredImageURL === '') && <Image />}
            </Avatar>
            <Button
              variant="contained"
              sx={{
                borderRadius: '0 0 0.4rem 0.4rem',
                backgroundColor: theme.palette.secondary.main,
                '&:hover': {
                  backgroundColor: theme.palette.secondary.dark,
                },
                textTransform: 'none',
                width: '100%',
              }}
              onClick={() => {
                if (uploadInputRef.current) uploadInputRef.current.click();
              }}
            >
              Tải ảnh lên
              <input
                ref={uploadInputRef}
                type="file"
                onChange={handleUploadImage}
                style={{
                  display: 'none',
                }}
              />
            </Button>
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
                onChange={(e) =>
                  setDisplayingData({ ...displayingData, name: e.target.value })
                }
              />
              <TextField
                label="Miêu tả"
                variant="standard"
                color="secondary"
                multiline
                fullWidth
                value={displayingData?.description}
                onChange={(e) =>
                  setDisplayingData({
                    ...displayingData,
                    description: e.target.value,
                  })
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    color="secondary"
                    checked={displayingData?.isActive}
                    onChange={(e) =>
                      setDisplayingData({
                        ...displayingData,
                        isActive: e.target.checked,
                      })
                    }
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
                onClick={handleModalClose}
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
