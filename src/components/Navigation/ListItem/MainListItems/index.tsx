import { permissionRouteMap, useAvailablePermissions } from '@/lib/authorize';
import { Check } from '@mui/icons-material';
import { default as BarChartIcon } from '@mui/icons-material/BarChart';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import { default as PeopleIcon } from '@mui/icons-material/People';
import { default as ShoppingCartIcon } from '@mui/icons-material/ShoppingCart';
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
export const MainListItems = memo((props: any) => {
  //#region Hooks

  const router = useRouter();
  const { open } = props;

  const { available, loading } = useAvailablePermissions();

  if (available && !loading) {
    if (available.length <= 0) {
      router.push('/');
    } else if (
      !available.map((p) => permissionRouteMap.get(p)).includes(router.pathname)
    ) {
      router.push(permissionRouteMap.get(available[0]) ?? '/');
    }
  }

  return (
    <React.Fragment>
      {/* <ListItemButton
        sx={{ height: '60px' }}
        onClick={() => router.push('/manager/dashboard')}
      >
        <ListItemIcon
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'space-between' : 'center',
          }}
        >
          <DashboardIcon sx={iconSxProps('dashboard')} />
        </ListItemIcon>
        {open && (
          <>
            <ListItemText
              primary={
                <Typography variant="body1" sx={typographySxProps('dashboard')}>
                  Dashboard
                </Typography>
              }
            />
            {isActive('dashboard') && <Check color="secondary" />}
          </>
        )}
      </ListItemButton> */}

      {available && available.includes('KHO') && (
        <ListItemButton
          sx={{
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'space-between' : 'center',
          }}
          onClick={() => router.push('/manager/storage')}
        >
          <ListItemIcon
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: open ? 'space-between' : 'center',
            }}
          >
            <Inventory2RoundedIcon sx={iconSxProps('storage')} />
          </ListItemIcon>
          {open && (
            <>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={typographySxProps('storage')}>
                    Kho hàng
                  </Typography>
                }
              />
              {isActive('storage') && <Check color="secondary" />}
            </>
          )}
        </ListItemButton>
      )}

      {available && available.includes('ĐH') && (
        <ListItemButton
          sx={{
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'space-between' : 'center',
          }}
          onClick={() => router.push('/manager/orders')}
        >
          <ListItemIcon
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: open ? 'space-between' : 'center',
            }}
          >
            <ShoppingCartIcon sx={iconSxProps('orders')} />
          </ListItemIcon>
          {open && (
            <>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={typographySxProps('orders')}>
                    Đơn hàng
                  </Typography>
                }
              />
              {isActive('orders') && <Check color="secondary" />}
            </>
          )}
        </ListItemButton>
      )}

      {available && available.includes('KH') && (
        <ListItemButton
          sx={{
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'space-between' : 'center',
          }}
          onClick={() => router.push('/manager/customers')}
        >
          <ListItemIcon
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: open ? 'space-between' : 'center',
            }}
          >
            <PeopleIcon sx={iconSxProps('customers')} />
          </ListItemIcon>
          {open && (
            <>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    sx={typographySxProps('customers')}
                  >
                    Khách hàng
                  </Typography>
                }
              />
              {isActive('customers') && <Check color="secondary" />}
            </>
          )}
        </ListItemButton>
      )}

      {available && available.includes('BC') && (
        <ListItemButton
          sx={{
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'space-between' : 'center',
          }}
          onClick={() => router.push('/manager/reports')}
        >
          <ListItemIcon
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: open ? 'space-between' : 'center',
            }}
          >
            <BarChartIcon sx={iconSxProps('reports')} />
          </ListItemIcon>
          {open && (
            <>
              <ListItemText
                primary={
                  <Typography variant="body1" sx={typographySxProps('reports')}>
                    Báo cáo
                  </Typography>
                }
              />
              {isActive('reports') && <Check color="secondary" />}
            </>
          )}
        </ListItemButton>
      )}

      {available && available.includes('PQ') && (
        <ListItemButton
          sx={{
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: open ? 'space-between' : 'center',
          }}
          onClick={() => router.push('/manager/authorize')}
        >
          <ListItemIcon
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: open ? 'space-between' : 'center',
            }}
          >
            <BarChartIcon sx={iconSxProps('authorize')} />
          </ListItemIcon>
          {open && (
            <>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    sx={typographySxProps('authorize')}
                  >
                    Phân quyền
                  </Typography>
                }
              />
              {isActive('authorize') && <Check color="secondary" />}
            </>
          )}
        </ListItemButton>
      )}
    </React.Fragment>
  );
});

export default MainListItems;
