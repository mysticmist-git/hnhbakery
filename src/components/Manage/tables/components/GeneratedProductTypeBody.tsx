import { ManageContext } from '@/lib/contexts';
import { ManageContextType } from '@/lib/localLib/manage';
import { ProductTypeObject } from '@/lib/models';
import theme from '@/styles/themes/lightTheme';
import {
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  hslToRgb,
} from '@mui/material';
import { memo, useContext, useEffect, useState } from 'react';
import RowActionButtons from './RowActionButtons';

const statusTextResolver = (isActive: boolean) => {
  return isActive ? 'Còn cung cấp' : 'Ngưng cung cấp';
};

const GeneratedProductTypeTableBody = () => {
  const {
    state,
    handleDeleteRowOnFirestore: handleDeleteRow,
    handleSearchFilter,
  } = useContext<ManageContextType>(ManageContext);

  const [displayMainDocs, setDisplayMainDocs] = useState<
    ProductTypeObject[] | null
  >([]);

  useEffect(() => {
    if (!state.mainDocs) return;

    const mainDocs: ProductTypeObject[] = state.mainDocs as ProductTypeObject[];

    const filterActiveDocs = state.isDisplayActiveOnly
      ? mainDocs.filter((doc) => doc.isActive)
      : mainDocs;

    setDisplayMainDocs(() => filterActiveDocs);
  }, [state.mainDocs, state.isDisplayActiveOnly]);

  return (
    <>
      {handleSearchFilter(displayMainDocs)?.map((doc, index) => (
        <TableRow
          key={doc.id}
          sx={{
            '&:last-child td, &:last-child th': { border: 0 },
          }}
        >
          <TableCell component="th" scope="row">
            <Tooltip title={index + 1}>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.common.black,
                }}
              >
                {index + 1}
              </Typography>
            </Tooltip>
          </TableCell>
          <TableCell>
            <Tooltip title={doc.name}>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.common.black }}
              >
                {doc.name}
              </Typography>
            </Tooltip>
          </TableCell>
          <TableCell>
            <Tooltip title={doc.description}>
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
            </Tooltip>
          </TableCell>
          <TableCell>
            <Tooltip title={statusTextResolver(doc.isActive)}>
              <Typography
                variant="body2"
                sx={{
                  color: doc.isActive
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                }}
              >
                {statusTextResolver(doc.isActive)}
              </Typography>
            </Tooltip>
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
