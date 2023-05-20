import theme from '@/styles/themes/lightTheme';
import {
  Delete,
  RestartAlt,
  Close,
  Add,
  Edit,
  Check,
} from '@mui/icons-material';
import {
  Modal,
  Grid,
  Typography,
  IconButton,
  Button,
  Divider,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { memo, useContext } from 'react';
import { CollectionName } from '@/lib/models/utilities';
import { ManageActionType, ManageContextType } from '@/lib/localLib/manage';
import { ManageContext } from '@/lib/contexts';

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

const RowModalLayout = ({
  children,
  handleAddNewRow,
  handleUpdateRow,
  resetForm,
}: {
  children: React.ReactNode;
  handleAddNewRow: any;
  handleUpdateRow: any;
  resetForm: any;
}) => {
  //#region States

  const {
    state,
    dispatch,
    handleDeleteRowOnFirestore: handleDeleteRow,
    resetDisplayingData,
  } = useContext<ManageContextType>(ManageContext);

  //#endregion

  //#region Functions

  const getTitle = () => {
    const collectionName = state.selectedTarget?.collectionName;

    if (!collectionName) return 'Error loading title';

    switch (collectionName) {
      case CollectionName.ProductTypes:
        return state.crudModalMode === 'create'
          ? 'Thêm loại sản phẩm mới'
          : 'Loại sản phẩm';
      case CollectionName.Products:
        return state.crudModalMode === 'create'
          ? 'Thêm sản phẩm mới'
          : 'Sản phẩm';
      case CollectionName.Batches:
        return state.crudModalMode === 'create'
          ? 'Thêm lô hàng mới'
          : 'Lô hàng';
      default:
        return 'Error loading title';
    }
  };

  //#endregion

  //#region Handlers

  const handleModalClose = () => {
    // Clear images data
    // setFeaturedImageFile(null);
    // setFeaturedImageURL('');

    // Close
    dispatch({
      type: ManageActionType.SET_CRUD_MODAL_OPEN,
      payload: false,
    });
  };

  function handleToggleEditMode() {
    if (state.crudModalMode !== 'view') return;

    dispatch({
      type: ManageActionType.SET_CRUD_MODAL_MODE,
      payload: 'update',
    });
  }

  //#endregion

  return (
    <Modal
      open={state.crudModalOpen}
      onClose={handleModalClose}
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
              sx={{ color: theme.palette.common.black }}
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
              {['update'].includes(state.crudModalMode) && (
                <Button
                  color="secondary"
                  variant="outlined"
                  startIcon={<Check />}
                  onClick={handleUpdateRow}
                >
                  Cập nhật
                </Button>
              )}
              {['view'].includes(state.crudModalMode) && (
                <IconButton onClick={handleToggleEditMode} color="secondary">
                  <Edit />
                </IconButton>
              )}
              {['view', 'update'].includes(state.crudModalMode) && (
                <IconButton onClick={handleDeleteRow} color="secondary">
                  <Delete />
                </IconButton>
              )}
              {['create'].includes(state.crudModalMode) && (
                <Button
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
                  onClick={() => resetForm()}
                  startIcon={<RestartAlt />}
                >
                  Đặt lại
                </Button>
              )}
              <IconButton onClick={handleModalClose}>
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
              {/* {state.crudModalMode === 'update' && (
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{
                    borderRadius: '1rem',
                    textTransform: 'none',
                  }}
                  onClick={handleUpdateRow}
                >
                  Cập nhật
                </Button>
              )} */}
              <Button
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.common.gray,
                  '&:hover': {
                    backgroundColor: theme.palette.common.light,
                  },
                  paddingX: '1.5rem',
                }}
                onClick={handleModalClose}
              >
                Thoát
              </Button>
              {state.crudModalMode === 'create' && (
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
                  onClick={handleAddNewRow}
                  startIcon={<Add />}
                >
                  Thêm
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default memo(RowModalLayout);
