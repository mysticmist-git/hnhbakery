import theme from '@/styles/themes/lightTheme';
import { Wysiwyg, Delete } from '@mui/icons-material';
import { Box, TableCell, TableRow, Typography } from '@mui/material';
import { DocumentData } from 'firebase/firestore';
import { TableActionButton } from '../TableActionButton';
import { ProductTypeObject } from '@/lib/models';
import CustomTableBodyProps from '../lib/TableBodyProps';
import {
  ManageActionType,
  ManageContextType,
} from '@/pages/manager/lib/manage';
import { ManageContext } from '@/pages/manager/manage';
import { useContext } from 'react';
import RowActionButtons from './RowActionButtons';

const GeneratedProductTypeTableBody = () => {
  const { state, dispatch, handleDeleteRow, handleViewRow } =
    useContext<ManageContextType>(ManageContext);

  return (
    <>
      {state.mainDocs?.map((doc, index) => (
        <TableRow
          key={doc.id}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            <Typography>{index + 1}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{doc.name}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{doc.description}</Typography>
          </TableCell>
          <TableCell>
            <Typography
              sx={{
                color: doc.isActive ? 'green' : 'red',
              }}
            >
              {doc.isActive ? 'Còn cung cấp' : 'Ngưng cung cấp'}
            </Typography>
          </TableCell>
          <TableCell>
            <RowActionButtons doc={doc} />
          </TableCell>
        </TableRow>
      )) ?? <TableRow>Error loading body</TableRow>}
    </>
  );
};

export default GeneratedProductTypeTableBody;
