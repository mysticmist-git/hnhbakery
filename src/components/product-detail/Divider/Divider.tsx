import { Divider, Grid } from '@mui/material';
import React from 'react';

export default function MyDivider({}) {
  return (
    <Grid item xs={12}>
      <Grid item>
        <Divider />
      </Grid>
    </Grid>
  );
}
