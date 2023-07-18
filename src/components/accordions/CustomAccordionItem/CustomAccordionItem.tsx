import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  useTheme,
} from '@mui/material';
import React, { memo } from 'react';

const CustomAccordionItem = memo((props: any) => {
  const {
    heading = 'Heading',
    defaultExpanded = false,
    children = () => {},
  } = props;
  const theme = useTheme();
  return (
    <Accordion
      sx={{
        '&.MuiPaper-root': {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
        width: '100%',
      }}
      disableGutters
      defaultExpanded={defaultExpanded}
    >
      <AccordionSummary
        sx={{
          bgcolor: theme.palette.primary.main,
          transition: 'opacity 0.2s',
          '&:hover': {
            opacity: 0.85,
          },
        }}
        expandIcon={
          <ExpandMoreIcon sx={{ color: theme.palette.text.secondary }} />
        }
      >
        <Typography variant="button" color={theme.palette.common.black}>
          {heading}
        </Typography>
      </AccordionSummary>

      <AccordionDetails
        sx={{
          bgcolor: theme.palette.common.white,
        }}
      >
        <props.children />
      </AccordionDetails>
    </Accordion>
  );
});

export default CustomAccordionItem;
