import { TextareaAutosize, alpha } from '@mui/material';
import { styled } from '@mui/system';

const CustomTextarea = styled(TextareaAutosize)(
  ({ theme }) => `
    width: 100%;
    max-width: 100%;
    min-width: 100%;;
    font-family: Roboto;
    font-size: 16px;
    font-weight: 500;
    padding: 16px;
    color: ${theme.palette.common.black};
    border: none;
    box-shadow: none;
  
    &:hover {
      border: none;
    }
  
    &:focus {
       border: none;
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

export default CustomTextarea;
