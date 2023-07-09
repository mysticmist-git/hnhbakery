import { COLLECTION_NAME } from '@/lib/constants';
import {
  AddRowHandler,
  CommonRowModalProps,
  ModalDeleteHandler,
  ModalModeToggleHandler,
  UpdateRowHandler,
} from '@/lib/types/manage';
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
  Divider,
  Grid,
  IconButton,
  Modal,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import RowModalLayoutButton from '../RowModalLayoutButton';

const formStyle = {
  // These 4 below are positionings I used for larger
  // height viewports - centered
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // other styles...
  width: 840,
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

type RowModalLayoutProps = CommonRowModalProps & {
  open: boolean;
  children: React.ReactNode;
  handleAddRow: AddRowHandler;
  handleUpdateRow: UpdateRowHandler;
  handleDeleteRow: ModalDeleteHandler;
  handleToggleModalEditMode: ModalModeToggleHandler;
};

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
              {['update'].includes(mode) && (
                <RowModalLayoutButton
                  disabled={disabled}
                  variant="outlined"
                  color="secondary"
                  startIcon={<Cancel />}
                  onClick={() => handleCancelUpdateData()}
                >
                  Hủy
                </RowModalLayoutButton>
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
                  variant="outlined"
                  color="secondary"
                  size="small"
                  sx={{
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
              <RowModalLayoutButton
                disabled={disabled}
                variant="contained"
                sx={{
                  color: (theme) => theme.palette.common.white,
                  backgroundColor: (theme) => theme.palette.common.gray,
                  '&:hover': {
                    backgroundColor: (theme) => theme.palette.common.darkGray,
                  },
                }}
                onClick={() => handleClose()}
              >
                Thoát
              </RowModalLayoutButton>
              {['update'].includes(mode) && (
                <RowModalLayoutButton
                  disabled={disabled}
                  variant="contained"
                  color="secondary"
                  onClick={() => handleUpdateRow()}
                >
                  Cập nhật
                </RowModalLayoutButton>
              )}
              {mode === 'create' && (
                <RowModalLayoutButton
                  disabled={disabled}
                  variant="contained"
                  color="secondary"
                  onClick={() => handleAddRow()}
                  startIcon={<Add />}
                >
                  Thêm
                </RowModalLayoutButton>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}
