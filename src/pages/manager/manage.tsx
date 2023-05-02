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
import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { Add } from '@mui/icons-material';
import { CollectionName } from '@/lib/models/utilities';
import RowModal, { ModalMode } from './components/modals/RowModal';
import { getDocsFromQuerySnapshot } from '@/lib/firestore/firestoreLib';
import { TableActionButton } from './components/tables/TableActionButton';
import { CustomDataTable } from './components/tables';

const LOADING_TEXT = 'Loading...';
const PATH = '/manager/manage';

export interface CrudTarget {
  collectionName: CollectionName;
  label: string;
}

const crudTargets: CrudTarget[] = [
  {
    collectionName: CollectionName.ProductTypes,
    label: 'Loại sản phẩm',
  },
  {
    collectionName: CollectionName.Products,
    label: 'Sản phẩm',
  },
  {
    collectionName: CollectionName.Batches,
    label: 'Lô hàng',
  },
];

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

export default function Manage({
  mainDocs: paramMainDocs,
  mainCollectionName,
}: {
  mainDocs: DocumentData[];
  mainCollectionName: CollectionName;
}) {
  const [mainDocs, setMainDocs] = useState<DocumentData[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<CrudTarget>(
    crudTargets[0],
  );
  const [displayingRow, setDisplayingRow] = useState<DocumentData>({});
  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deletingId, setDeletingId] = useState<string>('');

  // Modals states
  const [rowModalOpen, setRowModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');

  // Current table
  const [currentTable, setCurrentTable] = useState<JSX.Element>();

  const theme = useTheme();

  console.log(displayingRow);

  const resetDisplayingRow = () => {
    switch (selectedTarget.collectionName) {
      case CollectionName.ProductTypes:
        setDisplayingRow(DEFAULT_ROW.PRODUCT_TYPE);
        break;
      case CollectionName.Products:
        setDisplayingRow(DEFAULT_ROW.PRODUCT);
        break;
      case CollectionName.Batches:
        setDisplayingRow(DEFAULT_ROW.BATCH);
        break;
    }
  };

  const generateAddNewRowText = () => {
    switch (selectedTarget.collectionName) {
      case CollectionName.ProductTypes:
        return 'Thêm loại sản phẩm';
      case CollectionName.Products:
        return 'Thêm sản phẩm';
      case CollectionName.Batches:
        return 'Thêm lô hàng';
    }
  };

  useEffect(() => {
    if (!rowModalOpen) return;

    resetDisplayingRow();
  }, [selectedTarget]);

  useEffect(() => {
    setMainDocs(paramMainDocs);
  }, [paramMainDocs]);

  useEffect(() => {
    router.push(`${PATH}?collectionName=${selectedTarget.collectionName}`);
  }, [selectedTarget]);

  /**
   * Updates the targets state when the value of the CRUD target selection has changed.
   *
   * @param {any} e - The event object passed from the target selection component.
   * @param {any} newValue - The new value selected in the target selection component.
   * @return {void} - This function does not return anything.
   */
  const handleCrudTargetChanged = (e: any, newValue: any) => {
    if (!newValue) return;

    setSelectedTarget(newValue);
  };

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const router = useRouter();

  const handleViewRow = (doc: DocumentData) => {
    setModalMode('update');
    setDisplayingRow(doc);
    setRowModalOpen(true);
  };

  const handleDeleteRow = (id: string) => {
    // Display modal
    setDeletingId(id);
    setDialogOpen(true);
  };

  const handleDeleteDocument = async () => {
    setLoading(true);

    const id = deletingId;
    console.log('Deleting document with id:', id);

    try {
      await deleteDoc(doc(db, selectedTarget.collectionName, id));
      console.log('Document deleted successfully!');
    } catch (error) {
      console.log('Error deleting document:', error);
    }

    setLoading(false);

    // Remove row from table
    setMainDocs(mainDocs.filter((doc) => doc.id !== id));
    setDeletingId('');
    setDialogOpen(false);
  };

  const handleNewRow = () => {
    setModalMode('create');
    resetDisplayingRow();
    setRowModalOpen(true);
  };

  const handleCloseModal = () => {
    setRowModalOpen(false);
  };

  return (
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
        inputValue={selectedTarget.label || LOADING_TEXT}
        value={selectedTarget}
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

      {/* Table */}
      <CustomDataTable
        mainDocs={mainDocs}
        mainCollectionName={mainCollectionName}
        setModalMode={setModalMode}
        handleViewRow={handleViewRow}
        handleDeleteRow={handleDeleteRow}
      />

      <Divider
        sx={{
          mt: 4,
        }}
      />
      {/* Dialogs */}
      <Dialog
        open={dialogOpen}
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
      {rowModalOpen && (
        <RowModal
          open={rowModalOpen}
          displayingData={displayingRow}
          setDisplayingData={setDisplayingRow}
          onClose={() => setRowModalOpen(false)}
          mainDocs={mainDocs}
          setMainDocs={setMainDocs}
          collectionName={selectedTarget.collectionName}
          mode={modalMode}
          setMode={setModalMode}
          handleDeleteRow={handleDeleteRow}
          resetDisplayingRow={resetDisplayingRow}
        />
      )}
    </Container>
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
  console.log('collectionName: ', collectionName);

  // If the collection name is not present in the URL, redirect to the first collection.
  if (!collectionName) {
    const firstCollection = crudTargets[0].collectionName;
    console.log('Redirecting to first collection: ', firstCollection);
    return {
      redirect: {
        destination: `${PATH}?collectionName=${firstCollection}`,
        permanent: false,
      },
    };
  }

  // Get the documents from the specified collection.
  const collectionRef = collection(db, collectionName as string);
  console.log('collectionRef: ', collectionRef);
  const querySnapshot = await getDocs(collectionRef);
  const mainDocs = getDocsFromQuerySnapshot(querySnapshot);
  console.log('mainDocs: ', mainDocs);

  // Return the main documents as props.
  return {
    props: {
      mainDocs,
      mainCollectionName: collectionName,
    },
  };
};
