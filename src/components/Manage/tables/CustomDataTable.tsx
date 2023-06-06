import { ManageContext } from '@/lib/contexts';
import { ManageContextType } from '@/lib/localLib';
import BaseObject from '@/lib/models/BaseObject';
import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { createContext, memo, useContext } from 'react';
import GeneratedTableBody from './components/GeneratedTableBody';
import GeneratedTableHead from './components/GeneratedTableHead';

export const CustomDataTableContext = createContext<{
  displayMainDocs: BaseObject[];
}>({ displayMainDocs: [] });

const CustomDataTable = () => {
  const { state } = useContext<ManageContextType>(ManageContext);

  return (
    <>
      {state.mainDocs && (
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
      )}
      {!state.mainDocs && (
        <Skeleton
          variant="rectangular"
          width={'100%'}
          height={120}
          animation="wave"
        />
      )}
    </>
  );
};

export default memo(CustomDataTable);
