import theme from '@/styles/themes/lightTheme';
import { Wysiwyg, Delete } from '@mui/icons-material';
import { Box } from '@mui/system';
import { DocumentData, doc } from 'firebase/firestore';
import { TableActionButton } from '../TableActionButton';
import { ManageContext } from '@/lib/contexts';
import { memo, useContext } from 'react';
import { ManageContextType } from '@/lib/localLib/manage';
import { Typography } from '@mui/material';

const RowActionButtons = ({ doc }: { doc: DocumentData }) => {
  const {
    state,
    dispatch,
    handleViewRow,
    handleDeleteRowOnFirestore: handleDeleteRow,
  } = useContext<ManageContextType>(ManageContext);

  return (
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
          handleViewRow(doc);
        }}
      >
        <Typography variant="body2">Xem</Typography>
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
        <Typography variant="body2">Xóa</Typography>
      </TableActionButton>
    </Box>
  );
};

export default memo(RowActionButtons);
