import * as React from 'react';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { db } from '@/firebase/config';
import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import { fetchCollection, fetchDoc } from '@/lib/fetchData';
import { Close } from '@mui/icons-material';
import initialCrudTargets, { CrudTarget } from './manageTargets';
import { CollectionName, CollectionObj } from '@/lib/models/utilities';
import TargetDetail from '@/components/Manage/TargetDetail';
import CustomInput from '@/components/CustomInput';
import { FieldInfo } from './manageTargets';
import { ManageProps, Row } from './lib/manage';

/**
 * Manage page
 * @param param0 props
 * @returns
 */
export default function Manage({
  state,
  mainCollection,
  referenceCollections,
}: ManageProps) {
  const [crudTargets] = useState(initialCrudTargets);
  const [selectedTarget, setSelectedTarget] = useState(
    crudTargets.find(
      (crudTarget) =>
        crudTarget.collectionName === state?.currentSelectedCrudTarget,
    ) ?? crudTargets[0],
  );
  const [rows, setRows] = useState<Row[]>(mainCollection?.docs ?? []);
  const [selectedRow, setSelectedRow] = useState<Row | null>(null);
  const [selectedRowDetail, setSelectedRowDetail] = useState<Row | null>(null);

  const router = useRouter();

  /**
   * Automatically push the default path if the current path has no parameters
   * For example: '/manager/manage'
   * @param crudTarget The CRUD target that will be load if the path is empty
   */
  const pushPathOnTargetChanged = (crudTarget: CrudTarget) => {
    // Check if it has any references
    const references = JSON.stringify(
      crudTarget.fieldInfos
        .filter((fieldInfo: FieldInfo) => fieldInfo.fieldType === 'reference')
        .map((fieldInfo: FieldInfo) => fieldInfo.reference),
    );

    const pushInfo = {
      pathname: router.pathname,
      query: {
        collectionName: crudTarget.collectionName,
        references: references,
      },
    };

    router.push(pushInfo);
  };

  // Update the path whenever the selected crud target changed
  useEffect(() => {
    if (!router.query.collectionName) {
      pushPathOnTargetChanged(crudTargets[0]);
    }

    setRows(mainCollection?.docs ?? []);
  }, [mainCollection?.docs]);

  /**
   * Handle selected CRUD target changed
   * @param event event props
   */
  const handleSelectChange = (event: any) => {
    const targetName = event.target.value as string;
    const nextTarget = crudTargets.find((t) => t.name === targetName)!;
    setSelectedTarget(nextTarget);
    setRows([]);
    setSelectedRow(null);

    pushPathOnTargetChanged(nextTarget);
  };

  /**
   * Handle the algorithm to add an other row to the table and database
   */
  const handleAddRow = async () => {
    if (!selectedRow) return;

    const newDocRef = doc(collection(db, selectedTarget.collectionName));
    selectedRow.id = newDocRef.id;

    await setDoc(newDocRef, selectedRow);

    // Add new row to current datagrid
    setRows([...rows, selectedRow]);

    // Clear Fields
    setSelectedRow(null);

    // Add a detail too
    if (!selectedTarget.detail || !selectedRowDetail) return;

    const newDetailRef = doc(
      collection(db, selectedTarget.detail.collectionName),
    );
    selectedRow.id = newDetailRef.id;

    await setDoc(newDetailRef, selectedRowDetail);

    // Add new row to current datagrid
    // setRows([...rows, selectedRow]);
  };

  /**
   * Handle the update row operation
   */
  const handleUpdateRow = async () => {
    if (selectedRow) {
      setRows(
        rows.map((row) => (row.id === selectedRow.id ? selectedRow : row)),
      );
      // Convert selected row to suitable data
      const data = { ...selectedRow };

      // update data on firebase
      const docRef = doc(
        db,
        selectedTarget.collectionName,
        selectedRow.id as string,
      );
      await updateDoc(docRef, data);
    }
  };

  /**
   * Handle the update delete operation
   */
  const handleDeleteRow = async () => {
    if (selectedRow) {
      setRows(rows.filter((row) => row.id !== selectedRow.id));
      setSelectedRow(null);

      const docRef = doc(
        db,
        selectedTarget.collectionName,
        selectedRow.id as string,
      );
      await deleteDoc(docRef);
    }
  };

  return (
    <Container
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <FormControl
        fullWidth
        sx={{
          mt: 6,
        }}
      >
        <InputLabel id="crud-target-select-label">CRUD Target</InputLabel>
        <Select
          labelId="crud-target-select-label"
          id="crud-target-select"
          value={selectedTarget.name}
          label="CRUD Target"
          onChange={handleSelectChange}
        >
          {crudTargets.map((target: CrudTarget) => (
            <MenuItem key={target.name} value={target.name}>
              {target.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ height: 400, width: '100%', marginTop: '16px' }}>
        <DataGrid
          rows={rows}
          columns={selectedTarget.fieldInfos.map(
            (fieldInfo: FieldInfo) => fieldInfo.column,
          )}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          onRowClick={async (param) => {
            setSelectedRow(param.row);

            // Get the detail if has any
            if (!selectedTarget.detail) return;

            const fieldName = selectedTarget.fieldInfos.find(
              (fieldInfo) => fieldInfo.fieldType === 'detail',
            )?.column.field;

            const detailCollectionName = selectedTarget.detail.collectionName;
            const detailId: string =
              selectedRow && fieldName ? selectedRow[fieldName] : '';

            const detail = await fetchDoc(detailCollectionName, detailId);

            console.log('Main objet', selectedRow);
            console.log('CollectionName: ', detailCollectionName);
            console.log('DetailId: ', detailId);
            console.log('Detail: ', detail);

            setSelectedRowDetail(detail);
          }}
        />
      </Box>
      <Box>
        <Box
          sx={{
            display: 'flex',
            marginTop: '16px',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'true',
          }}
        >
          {selectedTarget.fieldInfos.map((fieldInfo) =>
            fieldInfo.column.field !== 'id'
              ? CustomInput(
                  fieldInfo,
                  selectedRow,
                  setSelectedRow,
                  referenceCollections?.filter(
                    (collection) =>
                      collection.collectionName === fieldInfo.reference,
                  )[0],
                )
              : null,
          )}
          <IconButton
            disabled={selectedRow === null}
            onClick={() => setSelectedRow(null)}
            sx={{
              ml: 1,
              color: (theme) =>
                selectedRow !== null
                  ? theme.palette.secondary.main
                  : theme.palette.common.gray,
              '&:hover': {
                color: (theme) =>
                  selectedRow !== null
                    ? theme.palette.secondary.light
                    : theme.palette.common.gray,
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>
        <Box sx={{ marginTop: '16px' }}>
          <Button variant="contained" onClick={handleAddRow}>
            Add
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateRow}
            sx={{ marginLeft: '8px' }}
          >
            Update
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteRow}
            sx={{ marginLeft: '8px' }}
          >
            Delete
          </Button>
        </Box>
        <Box mt={2}>
          {selectedTarget.detail ? (
            <>
              <Divider />
              <TargetDetail
                detail={selectedTarget.detail}
                sx={{
                  marginTop: '1rem',
                }}
                value={selectedRowDetail}
                setValue={setSelectedRowDetail}
              />
            </>
          ) : null}
        </Box>
      </Box>
    </Container>
  );
}

export async function getServerSideProps(context: any) {
  // Get collection name and references name
  const collectionName = context.query.collectionName;
  const referenceCollectionNames = context.query.references
    ? JSON.parse(context.query.references)
    : [];

  /**
   * Define a invalid-request return value
   * For now, it is nothing
   * */
  const invalidReturnValue = {
    props: {
      state: null,
      mainCollection: null,
      referenceCollections: null,
    },
  };

  // TODO: Finish this function
  /**
   * Verify the collection name
   * @param collectionName collection name that need to be verify
   * @returns whether the collection name is valid or not
   */
  const verifyCollectionName = (collectionName: string) =>
    collectionName ? true : false;

  // Verify those collection name and reference collection names
  if (!verifyCollectionName(collectionName)) return invalidReturnValue;

  referenceCollectionNames.forEach((name: string) => {
    if (name) return invalidReturnValue;
  });

  /**
   * The state of the manage page
   */
  interface State {
    currentSelectedTarget: string | 'default';
  }

  /**
   * This is the state of the mananing page
   */
  const state: State = {
    currentSelectedTarget: collectionName && 'default',
  };

  /**
   * The data of the current selected collection (CRUD Target)
   */
  const mainCollection = await fetchCollection(collectionName);

  /**
   * The data of those references collection
   */
  const referenceCollections: CollectionObj[] = [];

  for (const referenceCollectionName of referenceCollectionNames) {
    const fetchedReferenceDocs = await fetchCollection(referenceCollectionName);
    referenceCollections.push(fetchedReferenceDocs);
  }

  return {
    props: {
      state,
      mainCollection,

      referenceCollections,
    },
  };
}
