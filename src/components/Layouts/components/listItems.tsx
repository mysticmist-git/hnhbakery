import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useRouter } from 'next/router';
import { Check } from '@mui/icons-material';
import { Typography, useTheme } from '@mui/material';
import theme from '@/styles/themes/lightTheme';
import { memo } from 'react';

//#region Constants

const PATH = '/manager/';

//#endregion

//#region Functions

function isActive(route: string) {
  const router = useRouter();
  return router.pathname === `${PATH}${route}`;
}

function itemSxProps(route: string) {
  const theme = useTheme();

  const sx = [
    {},
    isActive(route) && {
      backgroundColor: '#eee',
    },
  ];

  return sx;
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
export const MainListItems = memo(() => {
  //#region Hooks

  const router = useRouter();

  //#endregion

  //#region States

  //#endregion

  //#region Console.Logs

  //#endregion

  return (
    <React.Fragment>
      <ListItemButton>
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
      <ListItemButton>
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
      <ListItemButton>
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
      <ListItemButton>
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
      <ListItemButton sx={itemSxProps('manage')}>
        <ListItemIcon>
          <LayersIcon sx={iconSxProps('manage')} />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography sx={typographySxProps('manage')}>Quản lý</Typography>
          }
        />
        {isActive('manage') && <Check color="secondary" />}
      </ListItemButton>
    </React.Fragment>
  );
});

export const SecondaryListItems = memo(() => {
  return (
    <React.Fragment>
      <ListSubheader component="div" inset>
        Báo cáo đã lưu
      </ListSubheader>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText
          sx={{ color: theme.palette.text.secondary }}
          primary="Tháng này"
        />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText
          sx={{ color: theme.palette.text.secondary }}
          primary="Quý trước"
        />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText
          sx={{ color: theme.palette.text.secondary }}
          primary="Year-end sale"
        />
      </ListItemButton>
    </React.Fragment>
  );
});
