import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Delete, Wysiwyg } from '@mui/icons-material';
import { useState } from 'react';
import { DocumentData } from 'firebase/firestore';
import theme from '@/styles/themes/lightTheme';
import { TableActionButton } from './TableActionButton';

export interface DataTableProps {
  mainDocs: DocumentData[];
  handleViewRow: any;
  handleDeleteRow: any;
  setModalMode: any;
}

const ProductTypeDataTable = ({
  mainDocs,
  handleViewRow,
  handleDeleteRow,
  setModalMode,
}: DataTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>STT</TableCell>
            <TableCell>ID</TableCell>
            <TableCell width={150}>Tên loại</TableCell>
            <TableCell>Mô tả</TableCell>
            <TableCell width={150}>Trạng thái</TableCell>
            <TableCell align="center">Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mainDocs.map((doc, index) => (
            <TableRow
              key={doc.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Typography>{index + 1}</Typography>
              </TableCell>
              <TableCell component="th" scope="row">
                <Typography>{doc.id}</Typography>
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
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTypeDataTable;
