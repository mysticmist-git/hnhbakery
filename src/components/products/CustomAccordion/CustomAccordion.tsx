import ProductsContext from '@/lib/contexts/productsContext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useContext, useMemo } from 'react';

// #region Filter
function CustomAccordion({
  label,
  children,
}: {
  label: string;
  children?: React.ReactNode;
}) {
  // const context = useContext(ProductsContext);
  const theme = useTheme();

  // const head_Information = useMemo(
  //   () => props.head_Information,
  //   [props.head_Information]
  // );

  return (
    <Accordion
      sx={{
        '&.MuiPaper-root': {
          backgroundColor: 'transparent',
          borderRadius: '8px',
          boxShadow: 'none',
        },
        width: '100%',
      }}
      disableGutters
      defaultExpanded
    >
      <AccordionSummary
        sx={{
          bgcolor: theme.palette.secondary.main,
          borderRadius: '8px 8px 0px 0px',
        }}
        expandIcon={
          <ExpandMoreIcon sx={{ color: theme.palette.common.white }} />
        }
      >
        <Typography variant="button" color={theme.palette.common.white}>
          {label}
        </Typography>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          bgcolor: theme.palette.common.white,
          border: 3,
          borderTop: 0,
          borderColor: theme.palette.secondary.main,
          borderRadius: '0 0 8px 8px',
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
}

export default CustomAccordion;
