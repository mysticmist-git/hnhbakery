import BaseObject from '@/lib/models/BaseObject';
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { createContext, memo } from 'react';
import GeneratedTableBody from './components/GeneratedTableBody';
import GeneratedTableHead from './components/GeneratedTableHead';

export const CustomDataTableContext = createContext<{
  displayMainDocs: BaseObject[];
}>({ displayMainDocs: [] });

const CustomDataTable = () => {
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

export default memo(CustomDataTable);
