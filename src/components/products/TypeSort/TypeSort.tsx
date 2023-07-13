import ProductsContext from '@/lib/contexts/productsContext';
import { SortListItem } from '@/lib/types/products';
import {
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@mui/material';
import { useContext } from 'react';

function TypeSort(props: any) {
  const theme = useTheme();
  const context = useContext(ProductsContext);
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
            Sắp xếp:
          </Typography>
        </Grid>
        <Grid item>
          <FormControl size="small">
            <Select
              value={context.SortList.value}
              onChange={(e) => context.handleSetSortList(e.target.value)}
              defaultValue={context.SortList.value}
              sx={{
                '& .MuiSvgIcon-root': {
                  color: theme.palette.common.white,
                },
                color: theme.palette.common.white,
                fontFamily: theme.typography.body2.fontFamily,
                fontSize: theme.typography.body2.fontSize,
                fontWeight: theme.typography.body2.fontWeight,
                minWidth: 180,
                bgcolor: theme.palette.secondary.main,
                borderRadius: '8px',
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    color: theme.palette.common.black,
                    '& .MuiMenuItem-root.Mui-selected': {
                      bgcolor: theme.palette.primary.main,
                    },
                    '& .MuiMenuItem-root:hover': {
                      backgroundColor: theme.palette.secondary.main,
                      color: theme.palette.common.white,
                    },
                    '& .MuiMenuItem-root.Mui-selected:hover': {
                      backgroundColor: theme.palette.secondary.main,
                      color: theme.palette.common.white,
                    },
                  },
                },
              }}
            >
              {context.SortList.options.map((item: SortListItem, i: number) => (
                <MenuItem
                  key={i}
                  value={item.value}
                  sx={{
                    fontFamily: theme.typography.body2.fontFamily,
                    fontSize: theme.typography.body2.fontSize,
                    fontWeight: theme.typography.body2.fontWeight,
                  }}
                >
                  {item.display}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
}

export default TypeSort;
