import { Divider, List } from '@mui/material';
import React from 'react';
import { MainListItems, SecondaryListItems } from './listItems';

export default function Sidebar() {
  return (
    <List component="nav">
      <MainListItems />
      <Divider sx={{ my: 1 }} />
      <SecondaryListItems />
    </List>
  );
}
