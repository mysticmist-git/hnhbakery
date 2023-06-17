import { StorageBatchObject } from '@/lib/firestore/firestoreLib';
import { GeneratedTableBodyProps } from '@/lib/localLib/manage';
import formatCurrency from '@/lib/utilities/formatCurrency';
import theme from '@/styles/themes/lightTheme';
import { TableCell, TableRow, Typography } from '@mui/material';
import { memo } from 'react';
import RowActionButtons from './RowActionButtons';

interface GeneratedBatchTableBodyProps extends GeneratedTableBodyProps {
  mainDocs: StorageBatchObject[] | null;
}

const GeneratedBatchTableBody = ({
  mainDocs,
  handleViewRow,
  handleDeleteRow,
}: GeneratedBatchTableBodyProps) => {
  return (
    <>
      {mainDocs &&
        mainDocs.map((doc, index) => (
          <TableRow
            key={doc.id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.common.black }}
              >
                {index + 1}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.common.black }}
              >
                {doc.productName}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.common.black }}
              >
                {doc.soldQuantity}/{doc.totalQuantity}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.common.black }}
              >
                {new Date(doc.MFG).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.common.black }}
              >
                {new Date(doc.EXP).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </Typography>
            </TableCell>
            <TableCell>{formatCurrency(doc.price)}</TableCell>
            <TableCell>
              <RowActionButtons
                doc={doc}
                handleViewRow={handleViewRow}
                handleDeleteRow={handleDeleteRow}
              />
            </TableCell>
          </TableRow>
        ))}
    </>
  );
};

export default memo(GeneratedBatchTableBody);
