import { Divider, List } from '@mui/material';
import React from 'react';
import { mainListItems, secondaryListItems } from './listItems';

export default function Sidebar() {
  return (
    <List component="nav">
      {mainListItems}
      <Divider sx={{ my: 1 }} />
      {secondaryListItems}
    </List>
  );
}
