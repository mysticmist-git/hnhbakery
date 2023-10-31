import {
  AutoAwesomeRounded,
  PhotoCameraBackRounded,
} from '@mui/icons-material';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect } from 'react';

function BookingTabs({
  tabIndex,
  handleChangeTab,
}: {
  tabIndex: number;
  handleChangeTab: (value: number) => void;
}) {
  const [value, setValue] = React.useState(tabIndex ?? 0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    handleChangeTab(value);
  }, [value]);
  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        centered
        textColor="secondary"
        indicatorColor="secondary"
      >
        <Tab
          icon={<PhotoCameraBackRounded />}
          label={<Typography variant="body1">Upload hình ảnh</Typography>}
        />
        <Tab
          icon={<AutoAwesomeRounded />}
          label={<Typography variant="body1">Tùy chỉnh trang trí</Typography>}
        />
      </Tabs>
    </Box>
  );
}

export default BookingTabs;
