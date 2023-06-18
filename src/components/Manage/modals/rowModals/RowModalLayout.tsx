import { COLLECTION_NAME } from '@/lib/constants';
import {
  AddRowHandler,
  CommonRowModalProps,
  ModalDeleteHandler,
  ModalModeToggleHandler,
  UpdateRowHandler,
} from '@/lib/localLib/manage';
import {
  Add,
  Cancel,
  Close,
  Delete,
  Edit,
  RestartAlt,
} from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Modal,
  Typography,
  styled,
} from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

const formStyle = {
  // These 4 below are positionings I used for larger
  // height viewports - centered
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // other styles...
  width: 800,
  bgcolor: 'background.paper',
  borderRadius: '1rem',
  boxShadow: 24,
  p: 4,
  marginTop: '2rem',
  // media query @ the max height you want (my case is the
  // height of the viewport before the cutoff phenomenon) -
  // set the top to '0' and translate the previous 'y'
  // positioning coordinate so the top of the modal is @ the
  // top of the viewport
  '@media(max-height: 890px)': {
    top: '0',
    transform: 'translate(-50%, 0%)',
  },
};

const LayoutButton = styled(Button)(({ theme }) => ({
  paddingX: '1.5rem',
  borderRadius: '1rem',
}));

interface RowModalLayoutProps extends CommonRowModalProps {
  open: boolean;
  children: React.ReactNode;
  handleAddRow: AddRowHandler;
  handleUpdateRow: UpdateRowHandler;
  handleDeleteRow: ModalDeleteHandler;
  handleToggleModalEditMode: ModalModeToggleHandler;
}

export default function RowModalLayout({
  open,
  children,
  mode,
  collectionName,
  handleAddRow,
  handleUpdateRow,
  handleDeleteRow,
  handleResetForm,
  handleModalClose,
  handleToggleModalEditMode,
  handleCancelUpdateData,
  disabled = false,
  loading = false,
}: RowModalLayoutProps) {
  //#region States
  //#endregion
  //#region Functions
  const getTitle = () => {
    if (!collectionName) return 'Error loading title';

    switch (collectionName) {
      case COLLECTION_NAME.PRODUCT_TYPES:
        return mode === 'create' ? 'Thêm loại sản phẩm mới' : 'Loại sản phẩm';
      case COLLECTION_NAME.PRODUCTS:
        return mode === 'create' ? 'Thêm sản phẩm mới' : 'Sản phẩm';
      case COLLECTION_NAME.BATCHES:
        return mode === 'create' ? 'Thêm lô hàng mới' : 'Lô hàng';
      default:
        return 'Error loading title';
    }
  };

  //#endregion
  //#region Handlers
  const handleClose = () => {
    handleModalClose();
  };

  //#endregion

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        overflowY: 'scroll',
      }}
      disableScrollLock={false}
    >
      <Box sx={formStyle}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{ color: (theme) => theme.palette.common.black }}
              variant="h5"
              fontWeight={'bold'}
            >
              {getTitle()}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              { loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: (theme) => theme.palette.secondary.main,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />)
              }

              {['update'].includes(mode) && (
                <Button
                  disabled={disabled}
                  variant="contained"
                  component="label"
                  startIcon={<Cancel />}
                  sx={{
                    mt: 1,
                    backgroundColor: (theme) => theme.palette.secondary.main,
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.secondary.dark,
                    },
                    textTransform: 'none',
                  }}
                  onClick={() => handleCancelUpdateData()}
                >
                  Hủy
                </Button>
              )}
              {['view'].includes(mode) && (
                <IconButton
                  disabled={disabled}
                  onClick={() => handleToggleModalEditMode()}
                  color="secondary"
                >
                  <Edit />
                </IconButton>
              )}
              {['view', 'update'].includes(mode) && (
                <IconButton
                  onClick={() => handleDeleteRow()}
                  color="secondary"
                  disabled={disabled}
                >
                  <Delete />
                </IconButton>
              )}
              {['create'].includes(mode) && (
                <Button
                  disabled={disabled}
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: 'common.gray',
                    '&:hover': {
                      backgroundColor: 'common.darkGray',
                    },
                    paddingX: '1rem',
                    borderRadius: '1rem',
                  }}
                  onClick={() => handleResetForm()}
                  startIcon={<RestartAlt />}
                >
                  Đặt lại
                </Button>
              )}
              <IconButton onClick={() => handleClose()} disabled={disabled}>
                <Close />
              </IconButton>
            </Box>
          </Box>
          <Divider
            sx={{
              my: '1rem',
            }}
          />
        </Grid>

        {/* Children */}
        {children}

        <Grid container spacing={2}>
          <Grid item xs={12}>
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
              {['update'].includes(mode) && (
                <Button
                  disabled={disabled}
                  variant="contained"
                  sx={{
                    backgroundColor: (theme) => theme.palette.common.gray,
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.common.darkGray,
                    },
                    paddingX: '1.5rem',
                  }}
                  onClick={() => handleUpdateRow()}
                >
                  Cập nhật
                </Button>
              )}
              <LayoutButton
                disabled={disabled}
                variant="contained"
                sx={{
                  backgroundColor: (theme) => theme.palette.common.gray,
                  '&:hover': {
                    backgroundColor: (theme) => theme.palette.common.darkGray,
                  },
                }}
                onClick={() => handleClose()}
              >
                Thoát
              </LayoutButton>
              {mode === 'create' && (
                <LayoutButton
                  disabled={disabled}
                  variant="contained"
                  onClick={() => handleAddRow()}
                  startIcon={<Add />}
                >
                  Thêm
                </LayoutButton>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
