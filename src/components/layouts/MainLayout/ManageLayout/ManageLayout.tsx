import Sidebar from '@/components/navigation/SideBar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import * as React from 'react';
import { memo } from 'react';

function Layout({ children }: { children: any }) {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const theme = useTheme();

  const underMD = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <Grid container direction="row" alignItems="flex-start" spacing={2}>
        <Grid
          item
          xs={12}
          md={open ? 3 : 1}
          lg={open ? 3 : 1}
          alignSelf={'stretch'}
          sx={{ transition: 'all 0.05s linear' }}
        >
          <Box
            sx={{
              minHeight: { md: '100vh', xs: 'auto' },
              height: { md: '100%', xs: 'auto' },
              bgcolor: 'common.white',
              py: 2,
              px: 0,
            }}
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
                    alignItems: 'center',
                    justifyContent:
                      !open && !underMD ? 'center' : 'space-between',
                    flexDirection: 'row',
                    p: 2,
                  }}
                >
                  {!open && !underMD ? (
                    <></>
                  ) : (
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
                    {open ? (
                      !underMD ? (
                        <ChevronLeftIcon />
                      ) : (
                        <CloseRoundedIcon />
                      )
                    ) : !underMD ? (
                      <ChevronRightIcon />
                    ) : (
                      <MenuRoundedIcon />
                    )}
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={12} display={!open && underMD ? 'none' : 'block'}>
                <Divider />
              </Grid>

              <Grid item xs={12} display={!open && underMD ? 'none' : 'block'}>
                <Sidebar open={open} />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          md={open ? 9 : 11}
          lg={open ? 9 : 11}
          alignSelf={'stretch'}
          sx={{ transition: 'all 0.05s linear' }}
        >
          {children}
        </Grid>
      </Grid>
    </>
  );
}

export default memo(Layout);
