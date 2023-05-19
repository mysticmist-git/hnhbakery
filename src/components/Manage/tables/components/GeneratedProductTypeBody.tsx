import theme from '@/styles/themes/lightTheme';
import { TableCell, TableRow, Typography } from '@mui/material';
import { ManageContext } from '@/pages/manager/manage';
import { memo, useContext } from 'react';
import RowActionButtons from './RowActionButtons';
import { ManageContextType } from '@/lib/localLib/manage';

const GeneratedProductTypeTableBody = () => {
  const {
    state,
    dispatch,
    handleDeleteRowOnFirestore: handleDeleteRow,
    handleViewRow,
  } = useContext<ManageContextType>(ManageContext);

  return (
    <>
      {state.mainDocs?.map((doc, index) => (
        <TableRow
          key={doc.id}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            <Typography sx={{ color: theme.palette.common.black }}>
              {index + 1}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ color: theme.palette.common.black }}>
              {doc.name}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography sx={{ color: theme.palette.common.black }}>
              {doc.description}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              sx={{
                color: doc.isActive
                  ? theme.palette.success.main
                  : theme.palette.error.main,
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

export default memo(GeneratedProductTypeTableBody);
