import { Button, styled } from '@mui/material';

//#region Styled Components
export const DialogButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));
