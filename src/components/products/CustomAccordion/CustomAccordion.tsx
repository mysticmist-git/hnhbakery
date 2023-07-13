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
function CustomAccordion(props: any) {
  const context = useContext(ProductsContext);
  const theme = useTheme();

  const head_Information = useMemo(
    () => props.head_Information,
    [props.head_Information]
  );

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
          {head_Information.heading}
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
        <FormGroup>
          {head_Information.children.map(
            (item: any, i: React.Key | null | undefined) => (
              <FormControlLabel
                key={i}
                control={
                  <Checkbox
                    sx={{ color: theme.palette.secondary.main }}
                    color="secondary"
                    checked={item.isChecked}
                    onChange={() =>
                      context.handleCheckBox(
                        head_Information.heading_value,
                        item.value
                      )
                    }
                  />
                }
                label={
                  <Typography
                    variant="button"
                    color={
                      item.color
                        ? theme.palette.common.white
                        : theme.palette.common.black
                    }
                    sx={{
                      px: item.color ? 1 : 0,
                      background: item.color ? item.value : 'transparent',
                      borderRadius: '4px',
                      width: '100%',
                    }}
                  >
                    {item.display}
                  </Typography>
                }
              />
            )
          )}
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );
}

export default CustomAccordion;
