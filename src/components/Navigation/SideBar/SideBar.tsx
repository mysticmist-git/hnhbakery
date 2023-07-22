import { List, useTheme } from '@mui/material';
import React from 'react';
import { MainListItems } from '../ListItem';

export default function Sidebar(props: any) {
  const theme = useTheme();
  const { open } = props;
  return (
    <List>
      <MainListItems open={open} />
      {/* <Divider sx={{ my: 1 }} />
      <SecondaryListItems open={open} /> */}
    </List>
  );
}
