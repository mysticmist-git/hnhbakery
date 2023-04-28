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
import { DataGrid, GridValueGetterParams } from '@mui/x-data-grid';
import FieldSet from '@/components/Manage/FieldSet';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { UnionType, isIdentifier } from 'typescript';
import { Add, AutoAwesome, Close, Delete } from '@mui/icons-material';
import { CollectionName } from '@/lib/models/utilities';
import { CrudTarget } from './lib/manage';

const initialCrudTargets: CrudTarget[] = [
  {
    label: 'Loại sản phẩm',
    collectionName: CollectionName.ProductTypes,
    columns: [
      { field: 'id', headerName: 'ID', width: 150 },
      { field: 'name', headerName: 'Tên', width: 150 },
      { field: 'description', headerName: 'Mô tả', width: 150 },
      {
        field: 'isActive',
        headerName: 'Trạng thái',
        width: 150,
        valueGetter: (params: GridValueGetterParams) =>
          params.row.isActive ? 'Còn cung cấp' : 'Ngưng cung cấp',
      },
    ],
  },
  {
    label: 'Sản phẩm',
    collectionName: CollectionName.Products,
    columns: [
      {
        field: 'id',
        headerName: 'ID',
        width: 150,
      },
      {
        field: 'productType_id',
        headerName: 'Loại',
        width: 150,
      },
      {
        field: 'name',
        headerName: 'Tên',
        width: 150,
      },
      {
        field: 'description',
        headerName: 'Miêu tả',
        width: 150,
      },
      {
        field: 'preservation',
        headerName: 'Bảo quản',
        width: 150,
      },
      {
        field: 'isActive',
        headerName: 'Trạng thái',
        width: 150,
        valueGetter: (params: GridValueGetterParams) =>
          params.row.isActive ? 'Còn cung cấp' : 'Ngưng cung cấp',
      },
    ],
  },
  {
    label: 'Lô hàng',
    collectionName: CollectionName.Batches,
    columns: [
      { field: 'id', headerName: 'ID', width: 150 },
      { field: 'totalQuantity', headerName: 'Tổng', width: 150 },
      { field: 'soldQuantity', headerName: 'Đã bán', width: 150 },
      { field: 'price', headerName: 'Giá gốc', width: 150 },
      { field: 'product_id', headerName: 'Sản phẩm', width: 150 },
    ],
  },
];

const LOADING_TEXT = 'Loading...';
const PATH = '/manager/manage';

export default function Manage({
  mainDocs: paramMainDocs,
}: {
  mainDocs: DocumentData[];
}) {
  const [mainDocs, setMainDocs] = useState(paramMainDocs);
  const [selectedTarget, setSelectedTarget] = useState(initialCrudTargets[0]);
  const [displayingRow, setDisplayingRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [originalData, setOriginalData] = useState(selectedRows);
  const [isSelectedRowChanged, setIsSelectedRowChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFieldsDisabled, setIsFieldsDisabled] = useState(false);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const router = useRouter();

  useEffect(() => {
    setOriginalData(displayingRow as any);
    setIsSelectedRowChanged(false);
  }, [displayingRow]);

  useEffect(() => {
    // Check if selected rows have changed from original data
    if (originalData && displayingRow && displayingRow !== originalData) {
      // If selected rows have changed, set state variable to true
      setIsSelectedRowChanged(true);
    }
  }, [displayingRow, originalData]);

  const handleRowSelectionModelChange = (newSelectionModel: any) => {
    setSelectedRows(newSelectionModel);

    if (newSelectionModel.length <= 0) {
      setDisplayingRow(null);
    }
  };

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

  /**
   * Handles a click event on a table row, selecting it.
   *
   * @param clickedValue - The value of the clicked row.
   * @returns The selected row value.
   */

  const handleRowClick = (clickedValue: any) => {
    if (
      selectedRows.length >= 1 ||
      selectedRows.includes(clickedValue.row.id as never)
    )
      return;

    setIsSelectedRowChanged(false);
    setDisplayingRow(clickedValue.row);
    setOriginalData(clickedValue.row);
  };

  /**
   * Adds a document to Firestore.
   *
   * @param {DocumentData} data - The data to add to the document.
   * @return {Promise<string>} A promise that resolves to the ID of the added document.
   * @throws {Error} If there's an error adding the document.
   */

  async function addDocumentToFirestore(data: DocumentData) {
    try {
      const addedDoc = await addDoc(
        collection(db, selectedTarget.collectionName),
        data,
      );

      console.log('Document added successfully!');

      return addedDoc.id;
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }

  /**
   * Sets the selected row to the given document data.
   *
   * @param {DocumentData} data - The document data to set as the selected row.
   */

  function addDocumentToClient(data: DocumentData) {
    setMainDocs([...mainDocs, data]);
  }

  /**
   * Adds a new document to Firestore by first removing the ID from the selected row data,
   * adding the data to Firestore, and then adding the document to the client.
   *
   * @throws {Error} If the selected row is falsy.
   */

  const handleAddNew = async () => {
    if (!displayingRow) return;

    setLoading(true);

    // Remove the id
    const { id, ...data } = displayingRow as any;

    const justCreatedDocID = await addDocumentToFirestore(data);
    addDocumentToClient({ id: justCreatedDocID, ...data });

    setLoading(false);
  };

  /**
   * Updates the Firestore document with the provided data.
   * @param {DocumentData} data - The data to update the document with.
   */
  const updateDocumentToFirestore = async (data: DocumentData) => {
    try {
      await setDoc(doc(db, selectedTarget.collectionName, data.id), data);
      console.log('Document updated successfully!');
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  /**
   * Updates the client-side document list with the provided data.
   * @param {DocumentData} data - The data to update the document with.
   */
  const updateDocumentToClient = (data: DocumentData) => {
    setMainDocs(
      mainDocs.map((doc) => (doc.id === data.id ? { ...doc, ...data } : doc)),
    );
  };

  /**
   * Updates a document in Firestore and updates the client-side document list.
   */
  const handleUpdateRow = async () => {
    // If there is no selected row, do nothing and return early.
    if (!displayingRow) return;

    setLoading(true);

    // Update the document in Firestore with the selected row data.
    updateDocumentToFirestore(displayingRow);
    // Update the client-side document list with the selected row data.
    updateDocumentToClient(displayingRow);

    setLoading(false);

    setIsSelectedRowChanged(false);
  };

  const handleDeleteRow = async () => {
    if (!selectedRows) return;

    handleClickOpen();
  };

  /**
   * Handles deletion of a document by deleting it from the Firestore database and from the client-side state.
   */
  const handleDeleteDocument = async () => {
    // If no row is selected, return
    if (!selectedRows) return;

    // Set loading state to true
    setLoading(true);

    /**
     * Deletes documents from the Firestore database and from the client-side state.
     * @param {string[]} ids - An array of document IDs to be deleted.
     */
    const deleteDocuments = async (ids: string[]) => {
      console.log(ids);
      try {
        // Create a batch write object.
        const batch = writeBatch(db);

        // Loop through the list of IDs and add a delete operation to the batch for each one.
        ids.forEach((id) => {
          console.log(`Deleteing ${id}`);
          const docRef = doc(db, selectedTarget.collectionName, id);
          batch.delete(docRef);
        });

        // Commit the batch write.
        await batch.commit();
      } catch (error) {
        console.error(error);
      }

      // Delete the documents from the client-side state.
      setMainDocs(mainDocs.filter((doc) => !ids.includes(doc.id)));
    };

    // Delete the documents from the Firestore database and from the client-side state.
    await deleteDocuments(selectedRows);

    // Set loading state to false
    setLoading(false);

    // Close the modal
    handleClose();
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
        inputValue={selectedTarget?.label || LOADING_TEXT}
        value={selectedTarget}
        onChange={handleCrudTargetChanged}
        options={initialCrudTargets}
        sx={{ mt: 4, width: 300 }}
        renderInput={(params) => <TextField {...params} label="Movie" />}
      />

      {/* Field ID and meta stuff */}
      <Box>
        <Typography
          variant="h4"
          sx={{
            mt: 2,
          }}
        >
          Trường dữ liệu
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            mt: 2,
          }}
        >
          <Typography variant="h6">{`ID: ${
            (displayingRow as any)?.id ?? 'Vui lòng chọn dữ liệu'
          }`}</Typography>

          <Button
            variant="contained"
            startIcon={<Close />}
            size="small"
            sx={{
              borderRadius: '20px',
              backgroundColor: 'common.gray',
              '&:hover': {
                backgroundColor: 'common.veryLight',
              },
            }}
            disabled={!selectedRows}
            onClick={() => setDisplayingRow(null)}
          >
            Đặt lại
          </Button>
        </Box>
      </Box>

      {/* Fields */}
      <Box sx={{ my: '1rem' }}>
        <FieldSet
          target={selectedTarget}
          row={displayingRow}
          setRow={setDisplayingRow}
          isDisabled={isFieldsDisabled}
        />
      </Box>

      {/* Action buttons */}
      <Box
        sx={{
          display: 'flex',
          gap: '12px',
        }}
      >
        <Button
          variant="contained"
          onClick={handleAddNew}
          sx={{
            backgroundColor: 'common.black',
            '&:hover': {
              backgroundColor: 'common.light',
            },
          }}
          startIcon={<Add />}
          disabled={!displayingRow || isFieldsDisabled}
        >
          Thêm mới
        </Button>
        <Button
          variant="contained"
          onClick={handleUpdateRow}
          sx={{
            backgroundColor: 'common.black',
            '&:hover': {
              backgroundColor: 'common.light',
            },
          }}
          startIcon={<AutoAwesome />}
          disabled={
            !isSelectedRowChanged ||
            isFieldsDisabled ||
            selectedRows.length <= 1
          }
        >
          Cập nhật
        </Button>
        <Button
          variant="contained"
          disabled={!selectedRows || selectedRows.length <= 1}
          onClick={handleDeleteRow}
          sx={{
            backgroundColor: 'secondary.light',
            '&:hover': {
              backgroundColor: 'secondary.dark',
            },
          }}
          startIcon={<Delete />}
        >
          Xóa
        </Button>
      </Box>

      {/* Table */}
      <DataGrid
        rows={mainDocs}
        columns={selectedTarget.columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 15,
            },
          },
        }}
        pageSizeOptions={[5]}
        onRowClick={handleRowClick}
        checkboxSelection
        onRowSelectionModelChange={handleRowSelectionModelChange}
        sx={{
          mt: 2,
          width: '100%',
        }}
      />

      <Divider
        sx={{
          mt: 4,
        }}
      />

      {/* Dialogs */}
      <Dialog
        open={open}
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
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get main docs
  const collectionName = context.query?.collectionName as string;

  if (!collectionName) {
    return {
      redirect: {
        destination: `${PATH}?collectionName=${initialCrudTargets[0].collectionName}`,
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
