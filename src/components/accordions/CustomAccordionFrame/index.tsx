import {
  Typography,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import React, { memo } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

//#region Hóa đơn của bạn
export const CustomAccordionFrame = memo((props: any) => {
  const { heading = 'Heading', children = () => {} } = props;
  const theme = useTheme();
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
          {heading}
        </Typography>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          bgcolor: theme.palette.common.white,
          border: 3,
          borderTop: 0,
          borderColor: theme.palette.secondary.main,
          borderRadius: '0 0 8px 8px',
          p: 0,
          overflow: 'hidden',
        }}
      >
        <props.children />
      </AccordionDetails>
    </Accordion>
  );
});
