import { Card, Grid, SxProps, Theme, Typography } from '@mui/material';
import React, { memo } from 'react';

const containerStyle: SxProps<Theme> = {
  padding: 4,
};

const cardStyle: SxProps<Theme> = {
  padding: 2,
};

/**
 * It is a Grid Wrapper
 * @param props props
 * @returns
 */
const CardWrapper = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <Card sx={cardStyle}>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ textAlign: 'left' }}>
            {title}
          </Typography>
        </Grid>
        {children}
      </Grid>
    </Card>
  );
};

const TopPart = () => {
  return <CardWrapper title="Doanh số">hello</CardWrapper>;
};

const LeftPart = () => {
  return <CardWrapper title="Kho hàng">hello</CardWrapper>;
};

const RightPart = () => {
  return <CardWrapper title="Đơn hàng">hello</CardWrapper>;
};

const Dashboard = () => {
  return (
    <Grid container spacing={2} sx={containerStyle}>
      <Grid item xs={12}>
        <Typography variant="h6" sx={{ textAlign: 'left' }}>
          Dashboard
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TopPart />
      </Grid>
      <Grid item xs={6}>
        <LeftPart />
      </Grid>
      <Grid item xs={6}>
        <RightPart />
      </Grid>
    </Grid>
  );
};

export default memo(Dashboard);
