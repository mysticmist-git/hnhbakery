import { DeleteRowHandler, ViewRowHandler } from '@/lib/localLib/manage';
import BaseObject from '@/lib/models/BaseObject';
import theme from '@/styles/themes/lightTheme';
import { Delete, Wysiwyg } from '@mui/icons-material';
import { Tooltip, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { memo } from 'react';
import { TableActionButton } from '../TableActionButton';

interface RowActionButtonsProps {
  doc: BaseObject;
  handleViewRow: ViewRowHandler;
  handleDeleteRow: DeleteRowHandler;
}

export default memo(function RowActionButtons({
  doc,
  handleViewRow,
  handleDeleteRow,
}: RowActionButtonsProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
      }}
    >
      <Tooltip title="Xem chi tiết">
        <TableActionButton
          variant="contained"
          startIcon={<Wysiwyg />}
          onClick={() => {
            handleViewRow(doc.id ?? '');
          }}
        >
          <Typography variant="body2">Xem</Typography>
        </TableActionButton>
      </Tooltip>
      <Tooltip title="Xóa">
        <TableActionButton
          variant="contained"
          startIcon={<Delete />}
          sx={{
            backgroundColor: theme.palette.secondary.main,
            '&:hover': {
              backgroundColor: theme.palette.secondary.dark,
            },
          }}
          onClick={() => handleDeleteRow(doc)}
        >
          <Typography variant="body2">Xóa</Typography>
        </TableActionButton>
      </Tooltip>
    </Box>
  );
});
