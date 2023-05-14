import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Delete, Wysiwyg } from '@mui/icons-material';
import { DocumentData, doc, getDoc, getDocs } from 'firebase/firestore';
import theme from '@/styles/themes/lightTheme';
import { TableActionButton } from './TableActionButton';
import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '@/firebase/config';
import { display } from '@mui/system';
import { CollectionName } from '@/lib/models/utilities';
import GeneratedTableHead from './components/GeneratedTableHead';
import GeneratedTableBody from './components/GeneratedTableBody';
import { ManageContext } from '../../manage';
import { ManageContextType } from '../../lib/manage';

export const CustomDataTableContext = createContext<{
  displayMainDocs: DocumentData[];
}>({ displayMainDocs: [] });

const CustomDataTable = () => {
  const { state, dispatch } = useContext<ManageContextType>(ManageContext);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <GeneratedTableHead />
          </TableRow>
        </TableHead>
        <TableBody>
          <GeneratedTableBody />
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomDataTable;
