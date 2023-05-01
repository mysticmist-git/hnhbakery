import theme from '@/styles/themes/lightTheme';
import { Wysiwyg, Delete } from '@mui/icons-material';
import { Box, TableCell, TableRow, Typography } from '@mui/material';
import { DocumentData } from 'firebase/firestore';
import { TableActionButton } from '../TableActionButton';

interface TableBodyProps {
  mainDocs: DocumentData[];
  displayMainDocs: DocumentData[];
  setModalMode: any;
  handleViewRow: any;
  handleDeleteRow: any;
}

const GeneratedProductTypeTableBody: React.FC<TableBodyProps> = (props) => {
  return (
    <>
      {props.mainDocs.map((doc, index) => (
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
                  props.setModalMode('update');
                  props.handleViewRow(doc);
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
                onClick={() => props.handleDeleteRow(doc.id)}
              >
                Xóa
              </TableActionButton>
            </Box>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default GeneratedProductTypeTableBody;
