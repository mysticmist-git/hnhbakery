import { ManageContext } from '@/lib/contexts';
import { ManageContextType } from '@/lib/localLib/manage';
import BaseObject from '@/lib/models/BaseObject';
import theme from '@/styles/themes/lightTheme';
import { Delete, Wysiwyg } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { memo, useContext } from 'react';
import { TableActionButton } from '../TableActionButton';

const RowActionButtons = ({ doc }: { doc: BaseObject }) => {
  const { handleViewRow, handleDeleteRowOnFirestore: handleDeleteRow } =
    useContext<ManageContextType>(ManageContext);

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
