import { Check } from '@mui/icons-material';
import BarChartIcon from '@mui/icons-material/BarChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LayersIcon from '@mui/icons-material/Layers';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Typography, useTheme } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useRouter } from 'next/router';
import * as React from 'react';
import { memo } from 'react';

//#region Constants

const PATH = '/manager/';

//#endregion

//#region Functions

function isActive(route: string) {
  const router = useRouter();
  return router.pathname === `${PATH}${route}`;
}
function iconSxProps(route: string) {
  const theme = useTheme();

  const sx = [
    {},
    isActive(route) && {
      color: theme.palette.secondary.main,
    },
  ];

  return sx;
}

function typographySxProps(route: string) {
  const theme = useTheme();

  const sx = [
    { color: theme.palette.text.secondary },
    isActive(route) && {
      color: theme.palette.secondary.main,
      fontWeight: 'bold',
    },
  ];

  return sx;
}

//#endregion

const MainListItems = () => {
  //#region Hooks

  const router = useRouter();

  return (
    <React.Fragment>
      <ListItemButton onClick={() => router.push('/manager/dashboard')}>
        <ListItemIcon>
          <DashboardIcon sx={iconSxProps('dashboard')} />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography sx={typographySxProps('dashboard')}>
              Dashboard
            </Typography>
          }
        />
        {isActive('dashboard') && <Check color="secondary" />}
      </ListItemButton>
      <ListItemButton onClick={() => router.push('/manager/orders')}>
        <ListItemIcon>
          <ShoppingCartIcon sx={iconSxProps('orders')} />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography sx={typographySxProps('orders')}>Đơn hàng</Typography>
          }
        />
        {isActive('orders') && <Check color="secondary" />}
      </ListItemButton>
      <ListItemButton onClick={() => router.push('/manager/customers')}>
        <ListItemIcon>
          <PeopleIcon sx={iconSxProps('customers')} />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography sx={typographySxProps('customers')}>
              Khách hàng
            </Typography>
          }
        />
        {isActive('customers') && <Check color="secondary" />}
      </ListItemButton>
      <ListItemButton onClick={() => router.push('/manager/reports')}>
        <ListItemIcon>
          <BarChartIcon sx={iconSxProps('reports')} />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography sx={typographySxProps('reports')}>Báo cáo</Typography>
          }
        />
        {isActive('reports') && <Check color="secondary" />}
      </ListItemButton>
      <ListItemButton onClick={() => router.push('/manager/manage')}>
        <ListItemIcon>
          <LayersIcon sx={iconSxProps('manage')} />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography sx={typographySxProps('manage')}>Kho hàng</Typography>
          }
        />
        {isActive('manage') && <Check color="secondary" />}
      </ListItemButton>
    </React.Fragment>
  );
};

export default memo(MainListItems);
