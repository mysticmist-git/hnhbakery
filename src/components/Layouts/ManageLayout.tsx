import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import * as React from 'react';
import { memo } from 'react';
import Sidebar from './components/Sidebar';

const drawerWidth: number = 240;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

function Layout({ children }: { children: any }) {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: [1],
            }}
          >
            {open && (
              <Link
                href="/"
                style={{
                  textDecoration: 'none',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: 'common.black',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    ml: '3.5rem',
                    '&:hover': {
                      color: 'secondary.main',
                    },
                  }}
                >
                  Trang chủ
                </Typography>
              </Link>
            )}
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <Sidebar />
        </Drawer>
        {children}
      </Box>
    </>
  );
}

export default memo(Layout);
