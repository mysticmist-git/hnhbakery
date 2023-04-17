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
import { fetchData } from '@/lib/fetchData';
import { Close } from '@mui/icons-material';
import initialCrudTargets, { CrudTarget } from './manageTargets';
import { CollectionName, CollectionObject } from '@/lib/models/utilities';
import TargetDetail from '@/components/Manage/TargetDetail';
import CustomInput from '@/components/CustomInput';
import { FieldInfo } from './manageTargets';

interface Row {
  id: string;
  [key: string]: any;
}

export default function Manage({
  docs,
  referenceDocs,
}: {
  docs: CollectionObject[];
  referenceDocs: ReferenceDocs[];
}) {
  const [crudTargets] = useState(initialCrudTargets);
  const [selectedTarget, setSelectedTarget] = useState(crudTargets[0]);
  const [rows, setRows] = useState<Row[]>(docs);
  const [selectedRow, setSelectedRow] = useState<Row | null>(null);
  const [selectedRowDetail, setSelectedRowDetail] = useState<Row | null>(null);

  const router = useRouter();

  console.log('Item', selectedRow);
  console.log('Detail', selectedRowDetail);

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

  useEffect(() => {
    if (!router.query.collectionName) {
      pushPathOnTargetChanged(crudTargets[0]);
    }

    setRows(docs);
  }, [docs]);

  const handleSelectChange = (event: any) => {
    const targetName = event.target.value as string;
    const nextTarget = crudTargets.find((t) => t.name === targetName)!;
    setSelectedTarget(nextTarget);
    setRows([]);
    setSelectedRow(null);

    pushPathOnTargetChanged(nextTarget);
  };

  const handleAddRow = async () => {
    if (!selectedRow) return;

    const newDocRef = doc(collection(db, 'productTypes'));
    selectedRow.id = newDocRef.id;

    await setDoc(newDocRef, selectedRow);

    // Add new row to current datagrid
    setRows([...rows, selectedRow]);

    // Clear Fields
    setSelectedRow(null);
  };

  const handleUpdateRow = async () => {
    if (selectedRow) {
      setRows(
        rows.map((row) => (row.id === selectedRow.id ? selectedRow : row)),
      );
      console.log(selectedRow);

      // Convert selected row to suitable data
      const data = { ...selectedRow };

      // update data on firebase
      const docRef = doc(db, 'productTypes', selectedRow.id as string);
      await updateDoc(docRef, data);
    }
  };

  const handleDeleteRow = async () => {
    if (selectedRow) {
      setRows(rows.filter((row) => row.id !== selectedRow.id));
      setSelectedRow(null);

      const docRef = doc(db, 'productTypes', selectedRow.id as string);
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
          onRowClick={(param) => {
            setSelectedRow(param.row);
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
                  referenceDocs.filter(
                    (docs) => docs.collectionName === fieldInfo.reference,
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

export interface ReferenceDocs {
  collectionName: CollectionName;
  docs: CollectionObject[];
}

export async function getServerSideProps(context: any) {
  const collectionName = context.query.collectionName;
  const references = context.query.references
    ? JSON.parse(context.query.references)
    : [];

  const docs = await fetchData(collectionName);

  const referenceDocs: ReferenceDocs[] = [];

  for (const reference of references) {
    const fetchedReferenceDocs = await fetchData(reference);
    referenceDocs.push({
      collectionName: reference,
      docs: fetchedReferenceDocs as CollectionObject[],
    });
  }

  return {
    props: {
      docs,
      referenceDocs,
    },
  };
}
