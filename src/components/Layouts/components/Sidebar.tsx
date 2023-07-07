import { Divider, List, useTheme } from '@mui/material';
import React from 'react';
import { MainListItems, SecondaryListItems } from './listItems';

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
