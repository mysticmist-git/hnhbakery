import { Button, styled } from '@mui/material';
import { memo } from 'react';

export const TableActionButton = memo(
  styled(Button)(({ theme }) => ({
    textTransform: 'none',
    borderRadius: '1rem',
    backgroundColor: theme.palette.common.light,
    '&:hover': {
      backgroundColor: theme.palette.common.black,
    },
  })),
);
