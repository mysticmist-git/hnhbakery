import * as React from 'react';
import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Autocomplete,
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { db } from '@/firebase/config';
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
} from 'firebase/firestore';
import { ProductTypeObject } from '@/lib/models/ProductType';
import { Router, useRouter } from 'next/router';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { BrandObject } from '@/lib/models/Brand';
import { fetchData } from '@/lib/fetchData';
import { Close } from '@mui/icons-material';

interface Row {
  id: string;
  [key: string]: any;
}

type FieldType = 'text' | 'isActive';

interface FieldInfo {
  fieldType: FieldType;
  column: GridColDef;
}

interface CrudTarget {
  name: string;
  collectionName: string;
  fieldInfos: FieldInfo[];
}

const initialCrudTargets: CrudTarget[] = [
  {
    name: 'Loại sản phẩm',
    collectionName: 'productTypes',
    fieldInfos: [
      {
        fieldType: 'text',
        column: { field: 'id', headerName: 'ID', width: 200 },
      },
      {
        fieldType: 'text',
        column: {
          field: 'productType_name',
          headerName: 'Tên loại',
          width: 130,
        },
      },
      {
        fieldType: 'text',
        column: {
          field: 'productType_description',
          headerName: 'Miêu tả',
          width: 130,
        },
      },
      {
        fieldType: 'text',
        column: { field: 'productType_image', headerName: 'Ảnh', width: 90 },
      },
      {
        fieldType: 'isActive',
        column: {
          field: 'productType_state',
          headerName: 'Trạng thái',
          width: 90,
        },
      },
    ],
  },
  {
    name: 'Thương hiệu',
    collectionName: 'brands',
    fieldInfos: [
      {
        fieldType: 'text',
        column: { field: 'id', headerName: 'ID', width: 200 },
      },
      {
        fieldType: 'text',
        column: { field: 'brand_name', headerName: 'Tên loại', width: 200 },
      },
      {
        fieldType: 'text',
        column: {
          field: 'brand_description',
          headerName: 'Miêu tả',
          width: 400,
        },
      },
    ],
  },
];

export default function Manage({ docs }: { docs: CollectionObject[] }) {
  const [crudTargets] = useState(initialCrudTargets);
  const [selectedTarget, setSelectedTarget] = useState(crudTargets[0]);
  const [rows, setRows] = useState<Row[]>(docs);
  const [selectedRow, setSelectedRow] = useState<Row | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!router.query.collectionName) {
      router.push({
        pathname: router.pathname,
        query: { collectionName: crudTargets[0].collectionName },
      });

      return;
    }

    setRows(docs);
  }, [docs]);

  const handleSelectChange = (event: any) => {
    const targetName = event.target.value as string;
    const nextTarget = crudTargets.find((t) => t.name === targetName)!;
    setSelectedTarget(nextTarget);
    setRows([]);
    setSelectedRow(null);

    router.push({
      pathname: router.pathname,
      query: { collectionName: nextTarget.collectionName },
    });
  };

  const renderInput = (fieldInfo: FieldInfo) => {
    switch (fieldInfo.fieldType) {
      case 'text':
        return (
          <TextField
            key={fieldInfo.column.field}
            label={fieldInfo.column.headerName}
            value={selectedRow?.[fieldInfo.column.field] || ''}
            onChange={(event) =>
              setSelectedRow({
                ...selectedRow!,
                [fieldInfo.column.field]: event.target.value,
              })
            }
            sx={{ marginRight: '8px' }}
          />
        );
      case 'isActive':
        return (
          <Autocomplete
            disablePortal
            options={[
              { label: 'Còn cung cấp', value: true },
              { label: 'Ngưng cung cấp', value: false },
            ]}
            value={selectedRow ? selectedRow[fieldInfo.column.field] : null}
            sx={{ width: 200, display: 'inline-block' }}
            onChange={(event, newValue) => {
              if (newValue) {
                setSelectedRow({
                  ...selectedRow!,
                  [fieldInfo.column.field]: newValue.value,
                });
                console.log(newValue);
              } else {
                // handle the case when newValue is null
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="Trạng thái" />
            )}
          />
        );
    }
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

      // update data on firebase
      const docRef = doc(db, 'productTypes', selectedRow.id as string);
      await updateDoc(docRef, selectedRow);
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
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
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
          {crudTargets.map((target) => (
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
            (fieldInfo) => fieldInfo.column,
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
            console.log(selectedRow);
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', marginTop: '16px', alignItems: 'center' }}>
        {selectedTarget.fieldInfos.map((fieldInfo) =>
          fieldInfo.column.field !== 'id' ? renderInput(fieldInfo) : null,
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
    </Container>
  );
}

enum CollectionName {
  ProductTypes = 'productTypes',
  Brands = 'brands',
}

type CollectionObject = ProductTypeObject | BrandObject;

export async function getServerSideProps(context: any) {
  const collectionName = context.query.collectionName;

  const docs = await fetchData(collectionName);
  return {
    props: {
      docs,
    },
  };
}
