import { db } from '@/firebase/config';
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {
  getDocs,
  collection,
  DocumentData,
  Timestamp,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { createContext, useEffect, useReducer, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { Add } from '@mui/icons-material';
import { CollectionName } from '@/lib/models/utilities';
import { getDocsFromQuerySnapshot } from '@/lib/firestore/firestoreLib';
import { TableActionButton } from './components/tables/TableActionButton';
import { CustomDataTable } from './components/tables';
import {
  ManageActionType,
  ManageContextType,
  crudTargets,
  initManageState,
  manageReducer,
} from './lib/manage';
import RowModal from './components/modals/RowModal';

const LOADING_TEXT = 'Loading...';
const PATH = '/manager/manage';

export interface CrudTarget {
  collectionName: CollectionName;
  label: string;
}

const DEFAULT_ROW = {
  PRODUCT_TYPE: {
    id: '',
    name: '',
    description: '',
    image: '',
    isActive: true,
  },
  PRODUCT: {
    id: '',
    productType_id: '',
    name: '',
    description: '',
    ingredients: [],
    materials: [],
    colors: [],
    sizes: [],
    howToUse: '',
    preservation: '',
    images: [],
    isActive: true,
  },
  BATCH: {
    id: '',
    totalQuantity: 0,
    soldQuantity: 0,
    MFG: Timestamp.fromDate(new Date()),
    EXP: Timestamp.fromDate(new Date()),
    material: 0,
    size: 0,
    color: 0,
    price: 0,
    discount: [],
    product_id: '',
  },
};

export const ManageContext = createContext<ManageContextType>({
  state: initManageState,
  dispatch: () => {},
  handleDeleteRow: () => {},
  handleViewRow: () => {},
  resetDisplayingData: () => {},
});

export default function Manage({
  mainDocs: paramMainDocs,
}: {
  mainDocs: DocumentData[];
}) {
  const [state, dispatch] = useReducer(manageReducer, initManageState);

  const theme = useTheme();

  const resetDisplayingData = () => {
    switch (state.selectedTarget.collectionName) {
      case CollectionName.ProductTypes:
        dispatch({
          type: ManageActionType.SET_DISPLAYING_DATA,
          payload: DEFAULT_ROW.PRODUCT_TYPE,
        });
        break;
      case CollectionName.Products:
        dispatch({
          type: ManageActionType.SET_DISPLAYING_DATA,
          payload: DEFAULT_ROW.PRODUCT,
        });
        break;
      case CollectionName.Batches:
        dispatch({
          type: ManageActionType.SET_DISPLAYING_DATA,
          payload: DEFAULT_ROW.BATCH,
        });
        break;
    }
  };

  const generateAddNewRowText = () => {
    switch (state.selectedTarget.collectionName) {
      case CollectionName.ProductTypes:
        return 'Thêm loại sản phẩm';
      case CollectionName.Products:
        return 'Thêm sản phẩm';
      case CollectionName.Batches:
        return 'Thêm lô hàng';
    }
  };

  useEffect(() => {
    if (!state.crudModalOpen) return;

    resetDisplayingData();
  }, [state.selectedTarget]);

  useEffect(() => {
    dispatch({
      type: ManageActionType.SET_MAIN_DOCS,
      payload: paramMainDocs,
    });
  }, [paramMainDocs]);

  useEffect(() => {
    router.push(
      `${PATH}?collectionName=${state.selectedTarget.collectionName}`,
    );
  }, [state.selectedTarget]);

  /**
   * Updates the targets state when the value of the CRUD target selection has changed.
   *
   * @param {any} e - The event object passed from the target selection component.
   * @param {any} newValue - The new value selected in the target selection component.
   * @return {void} - This function does not return anything.
   */
  const handleCrudTargetChanged = (e: any, newValue: any) => {
    if (!newValue) return;

    console.log(newValue);

    dispatch({
      type: ManageActionType.SET_SELECTED_TARGET,
      payload: newValue,
    });
  };

  const handleClickOpen = () => {
    dispatch({
      type: ManageActionType.SET_DIALOG_OPEN,
      payload: true,
    });
  };

  const handleClose = () => {
    dispatch({
      type: ManageActionType.SET_DIALOG_OPEN,
      payload: false,
    });
  };

  const router = useRouter();

  const handleViewRow = (doc: DocumentData) => {
    dispatch({
      type: ManageActionType.SET_CRUD_MODAL_MODE,
      payload: 'update',
    });
    dispatch({
      type: ManageActionType.SET_DISPLAYING_DATA,
      payload: doc,
    });
    dispatch({
      type: ManageActionType.SET_CRUD_MODAL_OPEN,
      payload: true,
    });
  };

  const handleDeleteRow = (id: string) => {
    // Display modal
    dispatch({
      type: ManageActionType.SET_DELETING_ID,
      payload: id,
    });
    dispatch({
      type: ManageActionType.SET_DIALOG_OPEN,
      payload: true,
    });
  };

  const handleDeleteDocument = async () => {
    dispatch({
      type: ManageActionType.SET_LOADING,
      payload: true,
    });

    const id = state.deletingId;
    console.log('Deleting document with id:', id);

    try {
      await deleteDoc(doc(db, state.selectedTarget.collectionName, id));
      console.log('Document deleted successfully!');
    } catch (error) {
      console.log('Error deleting document:', error);
    }

    dispatch({
      type: ManageActionType.SET_LOADING,
      payload: false,
    });

    // Remove row from table
    dispatch({
      type: ManageActionType.SET_MAIN_DOCS,
      payload: state.mainDocs.filter((doc: DocumentData) => doc.id !== id),
    });
    dispatch({
      type: ManageActionType.SET_DELETING_ID,
      payload: '',
    });
    dispatch({
      type: ManageActionType.SET_DIALOG_OPEN,
      payload: false,
    });
  };

  const handleNewRow = () => {
    dispatch({
      type: ManageActionType.SET_CRUD_MODAL_MODE,
      payload: 'create',
    });
    resetDisplayingData();

    dispatch({
      type: ManageActionType.SET_CRUD_MODAL_OPEN,
      payload: true,
    });
  };

  const handleCloseModal = () => {
    dispatch({
      type: ManageActionType.SET_CRUD_MODAL_OPEN,
      payload: false,
    });
  };

  return (
    <ManageContext.Provider
      value={{
        state,
        dispatch,
        handleDeleteRow,
        handleViewRow,
        resetDisplayingData,
      }}
    >
      <Container
        sx={{
          my: 2,
        }}
      >
        {/* Title */}
        <Typography variant="h4">Quản lý kho</Typography>
        <Divider
          sx={{
            mt: 2,
          }}
        />
        {/* CRUD target */}
        <Autocomplete
          disablePortal
          id="crudtarget-select"
          inputValue={state.selectedTarget.label || LOADING_TEXT}
          value={state.selectedTarget}
          onChange={handleCrudTargetChanged}
          options={crudTargets}
          sx={{ mt: 4, width: 300 }}
          renderInput={(params) => (
            <TextField {...params} color="secondary" label="Kho" />
          )}
        />
        {/* Manage Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
            my: '1rem',
          }}
        >
          <TableActionButton
            startIcon={<Add />}
            variant="contained"
            sx={{
              backgroundColor: theme.palette.common.darkGray,
            }}
            onClick={handleNewRow}
          >
            {generateAddNewRowText()}
          </TableActionButton>
        </Box>

        {/* Table TODO: Xin hãy truyền các fields vào thay vì sử dụng trực tiếp từ context bởi vì làm như vậy
            thì component này sẽ không tái sử dụng được.
            Tất nhiên thì nếu không có ý định tái sử dụng component này thì để nó vậy cũng được. */}
        <CustomDataTable />

        <Divider
          sx={{
            mt: 4,
          }}
        />
        {/* Dialogs */}
        <Dialog
          open={state.dialogOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'Xóa đối tượng'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Bạn có chắc muốn xóa?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Thoát</Button>
            <Button onClick={handleDeleteDocument} autoFocus>
              Xóa
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modals */}
        {state.crudModalOpen && <RowModal />}
      </Container>
    </ManageContext.Provider>
  );
}

/**
 * Returns server-side props for the page.
 *
 * @param {Object} context - The context object received from Next.js.
 * @returns {Object} The server-side props object.
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Extract the collection name from the query parameter of the URL.
  const collectionName = context.query && context.query.collectionName;

  // If the collection name is not present in the URL, redirect to the first collection.
  if (!collectionName) {
    const firstCollection = crudTargets[0].collectionName;
    return {
      redirect: {
        destination: `${PATH}?collectionName=${firstCollection}`,
        permanent: false,
      },
    };
  }

  // Get the documents from the specified collection.
  const collectionRef = collection(db, collectionName as string);
  const querySnapshot = await getDocs(collectionRef);
  const mainDocs = getDocsFromQuerySnapshot(querySnapshot);

  // Return the main documents as props.
  return {
    props: {
      mainDocs,
    },
  };
};
