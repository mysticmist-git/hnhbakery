// #endregion

import { CustomIconButton } from '@/components/buttons';
import ProductsContext from '@/lib/contexts/productsContext';
import { GridView, ListAlt } from '@mui/icons-material';
import { Grid, Typography, useTheme } from '@mui/material';
import { useContext, useMemo } from 'react';

// #region View
function TypeView({
  viewState,
  handleSetViewState,
}: {
  viewState: 'grid' | 'list';
  handleSetViewState: (viewState: 'grid' | 'list') => void;
}) {
  const theme = useTheme();
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
    [
      theme.palette.common.black,
      theme.palette.common.white,
      theme.palette.secondary.main,
    ]
  );

  const ListTypeSort = useMemo(() => {
    return [
      {
        value: 'grid',
        Icon: (
          <GridView
            sx={viewState == 'grid' ? buttonStyles.fill : buttonStyles.nonFill}
          />
        ),
      },
      {
        value: 'list',
        Icon: (
          <ListAlt
            sx={viewState == 'list' ? buttonStyles.fill : buttonStyles.nonFill}
          />
        ),
      },
    ];
  }, [viewState, buttonStyles]);

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
              onClick={() => handleSetViewState(item.value as 'grid' | 'list')}
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
