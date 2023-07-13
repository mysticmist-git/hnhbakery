// #endregion

import { CustomIconButton } from '@/components/buttons';
import ProductsContext from '@/lib/contexts/productsContext';
import { GridView, ListAlt } from '@mui/icons-material';
import { Grid, Typography, useTheme } from '@mui/material';
import { useContext, useMemo } from 'react';

// #region View
function TypeView(props: any) {
  const theme = useTheme();
  const context = useContext(ProductsContext);

  const buttonStyles = useMemo(
    () => ({
      nonFill: {
        bgcolor: theme.palette.common.black,
        color: theme.palette.common.white,
        borderRadius: '4px',
      },
      fill: {
        bgcolor: theme.palette.secondary.main,
        color: theme.palette.common.white,
        borderRadius: '4px',
      },
    }),
    []
  );

  const ListTypeSort = useMemo(() => {
    return [
      {
        value: 'grid',
        Icon: (
          <GridView
            sx={
              context.View == 'grid' ? buttonStyles.fill : buttonStyles.nonFill
            }
          />
        ),
      },
      {
        value: 'list',
        Icon: (
          <ListAlt
            sx={
              context.View == 'list' ? buttonStyles.fill : buttonStyles.nonFill
            }
          />
        ),
      },
    ];
  }, [context.View, buttonStyles]);

  return (
    <>
      <Grid
        container
        direction={'row'}
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
      >
        <Grid item>
          <Typography variant="body2" color={theme.palette.common.black}>
            Xem dưới dạng:
          </Typography>
        </Grid>

        <Grid item>
          {ListTypeSort.map((item, i) => (
            <CustomIconButton
              key={i}
              onClick={() => context.handleSetViewState(item.value)}
            >
              {item.Icon}
            </CustomIconButton>
          ))}
        </Grid>
      </Grid>
    </>
  );
}

export default TypeView;
