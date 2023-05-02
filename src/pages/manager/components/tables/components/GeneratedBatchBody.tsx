import theme from '@/styles/themes/lightTheme';
import { Wysiwyg, Delete } from '@mui/icons-material';
import { TableRow, TableCell, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { DocumentData } from 'firebase/firestore';
import React from 'react';
import { TableActionButton } from '../TableActionButton';
import CustomTableBodyProps from '../lib/TableBodyProps';
import { BatchObject } from '@/lib/models/Batch';
interface BatchTableBodyProps extends CustomTableBodyProps {
  mainDocs?: BatchObject[];
  displayMainDocs?: BatchObject[];
}

const GeneratedBatchTableBody = ({
  mainDocs,
  displayMainDocs,
  setModalMode,
  handleViewRow,
  handleDeleteRow,
}: BatchTableBodyProps) => {
  return (
    <>
      {mainDocs?.map((doc, index) => (
        <TableRow
          key={doc.id}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell>
            <Typography>{index + 1}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{doc.product_id}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{doc.soldQuantity}</Typography>
          </TableCell>
          <TableCell>
            <Typography>{doc.totalQuantity}</Typography>
          </TableCell>
          <TableCell>
            <Typography>
              {new Date(doc.MFG).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography>
              {new Date(doc.EXP).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </TableCell>
          <TableCell>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <TableActionButton
                variant="contained"
                startIcon={<Wysiwyg />}
                onClick={() => {
                  setModalMode('update');
                  handleViewRow(doc);
                }}
              >
                Xem
              </TableActionButton>
              <TableActionButton
                variant="contained"
                startIcon={<Delete />}
                sx={{
                  backgroundColor: theme.palette.secondary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.dark,
                  },
                }}
                onClick={() => handleDeleteRow(doc.id)}
              >
                Xóa
              </TableActionButton>
            </Box>
          </TableCell>
        </TableRow>
      )) ?? <TableRow>Error loading body</TableRow>}
    </>
  );
};

export default GeneratedBatchTableBody;
