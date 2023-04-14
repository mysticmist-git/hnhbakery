import { AppBar, Toolbar, Typography } from '@mui/material';
import React from 'react';

export default function Navbar() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography>H&H Bakery</Typography>
        </Toolbar>
      </AppBar>
    </>
  );
}
