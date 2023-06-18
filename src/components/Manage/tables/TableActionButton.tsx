import { Button, styled } from '@mui/material';

export const TableActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: '1rem',
  backgroundColor: theme.palette.secondary.main,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));
