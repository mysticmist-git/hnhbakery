import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Grid, Typography } from '@mui/material';
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

const drawerWidth: string = '100%';

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
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        spacing={2}
      >
        <Grid item xs={12} md={open ? 4 : 'auto'} lg={open ? 3 : 'auto'}>
          <Drawer
            variant="permanent"
            open={open}
            sx={{ height: { md: '100vh', xs: 'auto' } }}
          >
            <Box
              sx={{ py: 2, px: open ? 4 : 0, width: '100%', height: '100%' }}
            >
              <Grid
                container
                direction={'row'}
                justifyContent={'center'}
                alignItems={'center'}
                spacing={2}
              >
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: open ? 'space-between' : 'center',
                      flexDirection: 'row',
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
                      {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12}>
                  <Sidebar />
                </Grid>
              </Grid>
            </Box>
          </Drawer>
        </Grid>
        <Grid item xs={12} md={open ? 8 : true} lg={open ? 9 : true}>
          {children}
        </Grid>
      </Grid>
    </>
  );
}

export default memo(Layout);
