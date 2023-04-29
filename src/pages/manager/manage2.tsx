import { db } from '@/firebase/config';
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Modal,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {
  getDocs,
  collection,
  QuerySnapshot,
  DocumentData,
  Timestamp,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  DataGrid,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import FieldSet from '@/components/Manage/FieldSet';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { UnionType, isIdentifier } from 'typescript';
import {
  Add,
  AutoAwesome,
  Close,
  Delete,
  Edit,
  Wysiwyg,
} from '@mui/icons-material';
import { CollectionName } from '@/lib/models/utilities';
import { CrudTarget } from './lib/manage';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { display } from '@mui/system';
import ViewRowModal from './components/modals/ViewRowModal';
import NewRowModal from './components/modals/NewRowModal';

const TableActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: '1rem',
  backgroundColor: theme.palette.common.light,
  '&:hover': {
    backgroundColor: theme.palette.common.black,
  },
}));
const LOADING_TEXT = 'Loading...';
const PATH = '/manager/manage2';

const crudTargets: CollectionName[] = [
  CollectionName.ProductTypes,
  CollectionName.Products,
  CollectionName.Batches,
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
}: {
  mainDocs: DocumentData[];
}) {
  const [mainDocs, setMainDocs] = useState(paramMainDocs);
  const [selectedTarget, setSelectedTarget] = useState<CollectionName>(
    crudTargets[0],
  );
  const [displayingRow, setDisplayingRow] = useState<DocumentData>({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [originalData, setOriginalData] = useState(selectedRows);
  const [isSelectedRowChanged, setIsSelectedRowChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFieldsDisabled, setIsFieldsDisabled] = useState(false);

  const [dialogOpen, setDialogOpen] = React.useState(false);

  // Modals states
  const [viewRowModalOpen, setViewRowModalOpen] = React.useState(false);
  const [newRowModalOpen, setNewRowModalOpen] = React.useState(false);

  const theme = useTheme();

  const resetDisplayingRow = () => {
    console.log('Reseting...');
    switch (selectedTarget) {
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

  useEffect(() => {
    resetDisplayingRow();
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

    router.push(`${PATH}?collectionName=${newValue.collectionName}`);
  };

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const router = useRouter();

  const handleViewRow = (doc: DocumentData) => {
    setDisplayingRow(doc);
    setViewRowModalOpen(true);
  };
  const handleEditRow = () => {};
  const handleDeleteRow = () => {};

  const handleNewRow = () => {
    resetDisplayingRow();
    setNewRowModalOpen(true);
  };

  const handleCloseModal = () => {
    setViewRowModalOpen(false);
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
        inputValue={selectedTarget || LOADING_TEXT}
        value={selectedTarget}
        onChange={handleCrudTargetChanged}
        options={crudTargets}
        sx={{ mt: 4, width: 300 }}
        renderInput={(params) => <TextField {...params} label="Movie" />}
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
          Loại sản phẩm mới
        </TableActionButton>
      </Box>
      {/* Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên loại</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mainDocs.map((doc) => (
              <TableRow
                key={doc.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {doc.id}
                </TableCell>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.description}</TableCell>
                <TableCell>
                  {doc.isActive ? 'Còn cung cấp' : 'Ngưng cung cấp'}
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <TableActionButton
                      variant="contained"
                      startIcon={<Wysiwyg />}
                      onClick={() => handleViewRow(doc)}
                    >
                      Xem
                    </TableActionButton>
                    <TableActionButton
                      variant="contained"
                      startIcon={<Delete />}
                      onClick={handleDeleteRow}
                      sx={{
                        backgroundColor: theme.palette.secondary.main,
                        '&:hover': {
                          backgroundColor: theme.palette.secondary.dark,
                        },
                      }}
                    >
                      Xóa
                    </TableActionButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
          <Button onClick={handleClose} autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modals */}
      <ViewRowModal
        open={viewRowModalOpen}
        displayingData={displayingRow}
        setDisplayingData={setDisplayingRow}
        onClose={() => setViewRowModalOpen(false)}
      />

      <NewRowModal
        open={newRowModalOpen}
        displayingData={displayingRow}
        setDisplayingData={setDisplayingRow}
        onClose={() => setNewRowModalOpen(false)}
      />
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get main docs
  const collectionName = context.query?.collectionName as string;

  if (!collectionName) {
    return {
      redirect: {
        destination: `${PATH}?collectionName=${crudTargets[0]}`,
        permanent: false,
      },
    };
  }

  const querySnapshot = await getDocs(collection(db, collectionName));

  const mainDocs = getDocsFromQuerySnapshot(querySnapshot);

  return {
    props: {
      mainDocs,
    },
  };
};

/**
 * Returns an array of DocumentData obtained from a QuerySnapshot.
 *
 * @param {QuerySnapshot<DocumentData>} querySnapshot - The QuerySnapshot to obtain DocumentData from.
 * @return {DocumentData[]} An array of DocumentData obtained from the QuerySnapshot.
 */

function getDocsFromQuerySnapshot(
  querySnapshot: QuerySnapshot<DocumentData>,
): DocumentData[] {
  // Null check
  if (!querySnapshot) return [];

  // Get docs
  let docs: DocumentData[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    // Convert Date objects to ISO strings
    Object.keys(data).forEach((key) => {
      if (data[key] instanceof Timestamp) {
        data[key] = data[key].toDate().toISOString();
      }
    });
    docs.push({ id: doc.id, ...data });
  });

  return docs;
}
