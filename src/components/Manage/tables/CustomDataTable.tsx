import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { DocumentData } from 'firebase/firestore';
import { createContext, memo } from 'react';
import GeneratedTableHead from './components/GeneratedTableHead';
import GeneratedTableBody from './components/GeneratedTableBody';
import theme from '@/styles/themes/lightTheme';

export const CustomDataTableContext = createContext<{
  displayMainDocs: DocumentData[];
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
