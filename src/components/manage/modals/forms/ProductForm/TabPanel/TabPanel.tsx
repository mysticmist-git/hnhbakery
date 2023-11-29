import theme from '@/styles/themes/lightTheme';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { memo } from 'react';

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box component={'div'} sx={{ p: 3 }}>
          <Typography sx={{ color: theme.palette.common.black }}>
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default memo(TabPanel);
