import { Button, styled } from '@mui/material';

export const TableActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: '1rem',
  backgroundColor: theme.palette.common.light,
  '&:hover': {
    backgroundColor: theme.palette.common.black,
  },
}));
