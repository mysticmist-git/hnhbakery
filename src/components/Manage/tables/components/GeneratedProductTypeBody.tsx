import { StorageProductTypeObject } from '@/lib/firestore/firestoreLib';
import {
  GeneratedTableBodyProps,
  ViewRowHandler,
  statusTextResolver,
} from '@/lib/localLib/manage';
import BaseObject from '@/lib/models/BaseObject';
import theme from '@/styles/themes/lightTheme';
import { TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { memo } from 'react';
import RowActionButtons from './RowActionButtons';

interface GeneratedProductTypeTableBodyProps extends GeneratedTableBodyProps {
  mainDocs: StorageProductTypeObject[] | null;
}

export default(function GeneratedProductTypeTableBody({
  mainDocs, handleViewRow, handleDeleteRow,
}: GeneratedProductTypeTableBodyProps) {
  return (
    <>
      {mainDocs &&
        mainDocs.map((doc, index) => (
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
              <Tooltip title={doc.productCount}>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.common.black }}
                >
                  {doc.productCount}
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
              <RowActionButtons
                doc={doc}
                handleViewRow={handleViewRow}
                handleDeleteRow={handleDeleteRow} />
            </TableCell>
          </TableRow>
        ))}
    </>
  );
});
