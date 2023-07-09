import { Button, styled } from '@mui/material';

const TableActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: '1rem',
  color: theme.palette.common.white,
  backgroundColor: theme.palette.secondary.main,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

export default TableActionButton;
