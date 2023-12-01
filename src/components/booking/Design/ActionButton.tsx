import { getModel3dByType } from '@/lib/DAO/model3dDAO';
import { getDownloadUrlFromFirebaseStorage } from '@/lib/firestore';
import Model3d from '@/models/model3d';
import { Model3DContext, Model3DProps } from '@/pages/booking';
import {
  AutoFixHighRounded,
  CakeRounded,
  DeleteRounded,
  EditRounded,
  FormatColorTextRounded,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  IconButtonProps,
  InputLabel,
  ListItemIcon,
  Menu,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ActiveDrag } from './Model3D';

function ActionButton({
  khuonBanhArray,
  trangTriArray,
}: {
  khuonBanhArray: Model3d[];
  trangTriArray: Model3d[];
}) {
  //#region Menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  //#endregion

  const { array, handleChangeContext, editIndex, reloadCanvas } =
    useContext(Model3DContext);

  //#region KhuonBanh
  const [openDialogKhuonBanh, setOpenDialogKhuonBanh] = React.useState(false);
  const [selectedKhuonBanh, setSelectedKhuonBanh] =
    React.useState<Model3d | null>(null);
  const handleSelectedKhuonBanh = useCallback((value: Model3d) => {
    setSelectedKhuonBanh(value);
  }, []);
  //#endregion

  //#region TrangTri
  const [openDialogTrangTri, setOpenDialogTrangTri] = React.useState(false);
  const [selectedTrangTri, setSelectedTrangTri] =
    React.useState<Model3d | null>(null);
  const handleSelectedTrangTri = useCallback((value: Model3d) => {
    setSelectedTrangTri(value);
  }, []);

  const ActiveDragData: { value: ActiveDrag; label: string }[] = useMemo(() => {
    return [
      {
        value: { id: 0 },
        label: 'Mặt trước',
      },
      {
        value: { id: 1 },
        label: 'Mặt sau',
      },
      {
        value: { id: 2 },
        label: 'Mặt trên',
      },
      {
        value: { id: 4 },
        label: 'Mặt phải',
      },
      {
        value: { id: 5 },
        label: 'Mặt trái',
      },
    ];
  }, []);

  const [selectedActiveDrag, setSelectedActiveDrag] =
    React.useState<ActiveDrag>({ id: -1 });
  //#endregion

  //#region Text
  const [openDialogText, setOpenDialogText] = React.useState(false);
  const [textField, setTextField] = React.useState('');
  //#endregion

  useEffect(() => {
    setSelectedKhuonBanh(
      khuonBanhArray.find((item) => item.file == array[0].path) || null
    );
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
          <EditRounded fontSize="inherit" />
        </IconButton>

        <IconButton
          {...IconButtonProps}
          disabled={editIndex == -1 || editIndex == 0}
          onClick={() => {
            if (!handleChangeContext || editIndex <= 0) {
              return;
            }
            confirm('Bạn muốn xóa mô hình?') &&
              handleChangeContext('delete', null, editIndex);
          }}
        >
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

        <MenuItem
          onClick={() => {
            setOpenDialogText(true);
            handleCloseMenu();
          }}
        >
          <ListItemIcon>
            <FormatColorTextRounded fontSize="small" />
          </ListItemIcon>
          <Typography variant="body2" noWrap>
            Văn bản
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
                      onClick={handleSelectedKhuonBanh}
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
                if (
                  !selectedKhuonBanh ||
                  !handleChangeContext ||
                  !reloadCanvas
                ) {
                  return;
                }
                const newValue: Model3DProps = {
                  ...array[0],
                  path: selectedKhuonBanh.file,
                };
                handleChangeContext('array', newValue, 0);
                reloadCanvas();
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
            <FormControl fullWidth>
              <InputLabel color="secondary" size="small">
                Mặt trang trí
              </InputLabel>
              <Select
                size="small"
                color="secondary"
                value={JSON.stringify(selectedActiveDrag)}
                label="Mặt trang trí"
                onChange={(e: any) => {
                  setSelectedActiveDrag(JSON.parse(e.target.value));
                }}
                required
              >
                {ActiveDragData.map((item, index) => {
                  return (
                    <MenuItem key={index} value={JSON.stringify(item.value)}>
                      <Typography
                        variant="body1"
                        fontWeight={'regular'}
                        sx={{
                          py: 0.5,
                        }}
                      >
                        {item.label}
                      </Typography>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <Grid container spacing={2} justifyContent={'flex-start'}>
              {trangTriArray.map((item, index) => {
                return (
                  <Grid item key={index} xs={4}>
                    <CardItem
                      item={item}
                      selected={item === selectedTrangTri}
                      onClick={handleSelectedTrangTri}
                    />
                  </Grid>
                );
              })}
            </Grid>

            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                if (
                  !selectedTrangTri ||
                  !selectedActiveDrag ||
                  selectedActiveDrag.id == -1 ||
                  !handleChangeContext
                ) {
                  return;
                }
                const value: Model3DProps = {
                  path: selectedTrangTri.file,
                  planeId: selectedActiveDrag,
                };
                handleChangeContext('add', value);
                setOpenDialogTrangTri(false);
              }}
            >
              Thêm
            </Button>
          </Box>
        </DialogContent>
      </CustomDialog>

      {/* Dialog Text */}
      <CustomDialog
        open={openDialogText}
        title="Trang trí"
        handleClose={() => {
          setOpenDialogText(false);
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
            <FormControl fullWidth>
              <InputLabel color="secondary" size="small">
                Mặt trang trí
              </InputLabel>
              <Select
                size="small"
                color="secondary"
                value={JSON.stringify(selectedActiveDrag)}
                label="Mặt trang trí"
                onChange={(e: any) => {
                  setSelectedActiveDrag(JSON.parse(e.target.value));
                }}
                required
              >
                {ActiveDragData.map((item, index) => {
                  return (
                    <MenuItem key={index} value={JSON.stringify(item.value)}>
                      <Typography
                        variant="body1"
                        fontWeight={'regular'}
                        sx={{
                          py: 0.5,
                        }}
                      >
                        {item.label}
                      </Typography>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <TextField
              value={textField}
              onChange={(e) => {
                setTextField(e.target.value);
              }}
              color="secondary"
              size="small"
              placeholder="Văn bản"
              multiline
              rows={3}
            />

            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                if (
                  !selectedActiveDrag ||
                  selectedActiveDrag.id == -1 ||
                  !handleChangeContext
                ) {
                  return;
                }

                const value: Model3DProps = {
                  isText: true,
                  planeId: selectedActiveDrag,
                  children: [textField],
                };
                handleChangeContext('add', value);
                setOpenDialogText(false);
                setTextField('');
              }}
            >
              Thêm
            </Button>
          </Box>
        </DialogContent>
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
    transition: 'all 0.2s',
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
  onClick,
}: {
  item: Model3d;
  selected: boolean;
  onClick: (item: Model3d) => void;
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
        onClick={() => onClick(item)}
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
