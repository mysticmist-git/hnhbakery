import theme from '@/styles/themes/lightTheme';
import { TableCell, TableRow, Typography } from '@mui/material';
import { memo, useContext, useEffect, useMemo, useState } from 'react';
import RowActionButtons from './RowActionButtons';
import { ManageContextType } from '@/lib/localLib/manage';
import { ManageContext } from '@/lib/contexts';
import { DocumentData } from 'firebase/firestore';

const GeneratedProductTypeTableBody = () => {
  const {
    state,
    handleDeleteRowOnFirestore: handleDeleteRow,
    handleSearchFilter,
  } = useContext<ManageContextType>(ManageContext);

  const [displayMainDocs, setDisplayMainDocs] = useState<DocumentData[]>([]);

  useEffect(() => {
    // Filter isActive
    const filterActiveDocs = state.isDisplayActiveOnly
      ? state.mainDocs.filter((doc) => doc.isActive)
      : state.mainDocs;

    setDisplayMainDocs(() => filterActiveDocs);
  }, [state.mainDocs, state.isDisplayActiveOnly]);

  return (
    <>
      {handleSearchFilter(displayMainDocs)?.map((doc, index) => (
        <TableRow
          key={doc.id}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.common.black,
              }}
            >
              {index + 1}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.common.black }}
            >
              {doc.name}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.common.black,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
              }}
            >
              {doc.description}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              variant="body2"
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
