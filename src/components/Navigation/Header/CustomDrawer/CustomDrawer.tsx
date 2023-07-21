import { useTheme } from '@emotion/react';
import { DensityMediumOutlined } from '@mui/icons-material';
import { Drawer, Grid } from '@mui/material';
import { memo, useContext } from 'react';
import CustomTab from '../CustomTab';
import { NavbarContext } from '../Navbar/Navbar';
import RightMenu from '../RightMenu';

const CustomDrawer = (props: any) => {
  const theme = useTheme();
  const context = useContext(NavbarContext);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      context.handleSetDrawerOpenState(open);
    };

  return (
    <Drawer
      anchor={'right'}
      open={context.drawerOpen}
      onClose={toggleDrawer(false)}
      PaperProps={{
        sx: {
          bgcolor: (theme) => theme.palette.secondary.dark,
        },
      }}
    >
      <Grid
        sx={{ p: 1 }}
        height={'100%'}
        container
        direction={'column'}
        justifyContent={'space-between'}
        alignItems={'center'}
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <Grid item>
          <CustomTab orientation="vertical" />
        </Grid>
        <Grid item sx={{ mb: 2 }}>
          <Grid container direction={'column'} alignItems={'center'}>
            <RightMenu orientation="vertical" />
          </Grid>
        </Grid>
      </Grid>
    </Drawer>
  );
};

export default memo(CustomDrawer);
