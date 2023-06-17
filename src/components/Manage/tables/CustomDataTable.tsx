import { ViewRowHandler } from '@/lib/localLib/manage';
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
import { memo, useContext } from 'react';
import GeneratedTableBody from './components/GeneratedTableBody';
import GeneratedTableHead from './components/GeneratedTableHead';

interface CustomDataTableProps {
  mainDocs: BaseObject[] | null;
  collectionName: string;
  handleViewRow: ViewRowHandler;
}

const CustomDataTable = (props: CustomDataTableProps) => {
  return (
    <>
      {props.mainDocs && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <GeneratedTableHead collectionName={props.collectionName} />
              </TableRow>
            </TableHead>
            <TableBody>
              <GeneratedTableBody
                mainDocs={props.mainDocs}
                collectionName={props.collectionName}
                handleViewRow={props.handleViewRow}
              />
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {!props.mainDocs && (
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
