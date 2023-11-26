import { getModel3dByType } from '@/lib/DAO/model3dDAO';
import { getDownloadUrlFromFirebaseStorage } from '@/lib/firestore';
import Model3d from '@/models/model3d';
import { Model3DContext, Model3DProps } from '@/pages/booking';
import {
  AddRounded,
  AutoFixHighRounded,
  CakeRounded,
  DeleteRounded,
  FormatColorTextRounded,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  IconButtonProps,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import React, { useCallback, useContext, useEffect, useState } from 'react';

function ActionButton() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const { array, handleChangeContext } = useContext(Model3DContext);

  const [openDialogKhuonBanh, setOpenDialogKhuonBanh] = React.useState(false);
  const [khuonBanhArray, setKhuonBanhArray] = React.useState<Model3d[]>([]);
  const [selectedKhuonBanh, setSelectedKhuonBanh] =
    React.useState<Model3d | null>(null);
  const handleSelectedKhuonBanh = useCallback((value: Model3d) => {
    setSelectedKhuonBanh(value);
  }, []);

  const [openDialogTrangTri, setOpenDialogTrangTri] = React.useState(false);

  useEffect(() => {
    async function fetchData() {
      const khuonbanhs = await getModel3dByType('1');
      setKhuonBanhArray(khuonbanhs);

      setSelectedKhuonBanh(
        khuonbanhs.find((item) => item.file == array[0].path) || null
      );
    }
    fetchData();
  }, []);

  return (
    <>
      <Box
        component={'div'}
        sx={{
          width: '100%',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          color: 'white',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 1,
          px: 2,
          gap: 2,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <IconButton {...IconButtonProps} onClick={handleOpenMenu}>
          <AddRounded fontSize="inherit" />
        </IconButton>

        <IconButton {...IconButtonProps}>
          <DeleteRounded fontSize="inherit" />
        </IconButton>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            width: 200,
            borderRadius: 4,
          },
        }}
        sx={{
          mb: 2,
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <MenuItem
          onClick={() => {
            setOpenDialogKhuonBanh(true);
            handleCloseMenu();
          }}
        >
          <ListItemIcon>
            <CakeRounded fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2" noWrap>
            Khung bánh
          </Typography>
        </MenuItem>

        <MenuItem
          onClick={() => {
            setOpenDialogTrangTri(true);
            handleCloseMenu();
          }}
        >
          <ListItemIcon>
            <AutoFixHighRounded fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2" noWrap>
            Vật trang trí
          </Typography>
        </MenuItem>

        <MenuItem onClick={handleCloseMenu}>
          <ListItemIcon>
            <FormatColorTextRounded fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2" noWrap>
            Thông điệp
          </Typography>
        </MenuItem>
      </Menu>

      {/* Dialog Khuôn bánh */}
      <CustomDialog
        open={openDialogKhuonBanh}
        title="Khuôn bánh"
        handleClose={() => {
          setOpenDialogKhuonBanh(false);
          setSelectedKhuonBanh(
            khuonBanhArray.find((item) => item.file == array[0].path) || null
          );
        }}
      >
        <DialogContent>
          <Box
            component={'div'}
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Grid container spacing={2} justifyContent={'flex-start'}>
              {khuonBanhArray.map((item, index) => {
                return (
                  <Grid item key={index} xs={4}>
                    <CardItem
                      item={item}
                      selected={item === selectedKhuonBanh}
                      handleSelectedKhuonBanh={handleSelectedKhuonBanh}
                    />
                  </Grid>
                );
              })}
            </Grid>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setOpenDialogKhuonBanh(false);
                if (!selectedKhuonBanh || !handleChangeContext) {
                  return;
                }
                const newValue: Model3DProps = {
                  ...array[0],
                  path: selectedKhuonBanh.file,
                };
                handleChangeContext('array', newValue, 0);
              }}
            >
              Đổi
            </Button>
          </Box>
        </DialogContent>
      </CustomDialog>

      {/* Dialog Trang trí */}
      <CustomDialog
        open={openDialogTrangTri}
        title="Trang trí"
        handleClose={() => {
          setOpenDialogTrangTri(false);
        }}
      >
        <DialogTitle>Use Google's</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setOpenDialogTrangTri(false);
            }}
          >
            Thêm
          </Button>
        </DialogActions>
      </CustomDialog>
    </>
  );
}

export default ActionButton;

const IconButtonProps: IconButtonProps = {
  size: 'medium',
  sx: {
    color: 'white',
    backgroundColor: 'secondary.main',
    '&:hover': {
      backgroundColor: 'secondary.dark',
    },
    boxShadow: 3,
  },
};

function CustomDialog({
  open,
  title,
  handleClose,
  children,
}: {
  open: boolean;
  title: string;
  handleClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden',
          },
        }}
      >
        <Typography
          variant="body1"
          fontWeight={'bold'}
          sx={{
            width: '100%',
            textAlign: 'center',
            p: 1,
            backgroundColor: 'grey.400',
          }}
        >
          {title}
        </Typography>

        {children}
      </Dialog>
    </>
  );
}

function CardItem({
  item,
  selected,
  handleSelectedKhuonBanh,
}: {
  item: Model3d;
  selected: boolean;
  handleSelectedKhuonBanh: (item: Model3d) => void;
}) {
  const [image, setImage] = useState('');
  const [hover, setHover] = useState(false);
  useEffect(() => {
    async function getImage() {
      if (!item.image) {
        return;
      }
      setImage(await getDownloadUrlFromFirebaseStorage(item.image));
    }
    getImage();
  }, [item.image]);
  return (
    <>
      <Box
        component={'div'}
        sx={{
          width: '100%',
          minWidth: '100px',
          aspectRatio: '1/0.8',
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer',
          border: 6,
          borderColor: selected ? 'secondary.main' : 'primary.main',
        }}
        onClick={() => handleSelectedKhuonBanh(item)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Box
          component={'img'}
          src={image}
          alt="texture"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            background: '#1B1B1B',
          }}
        />
        <Box
          component={'div'}
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            p: 0.5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 1,
            transition: 'all 0.2s ease',
            opacity: hover ? 1 : 0,
          }}
        >
          <Typography
            variant="caption"
            fontWeight={'regular'}
            sx={{ color: 'white' }}
          >
            {item.name}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
