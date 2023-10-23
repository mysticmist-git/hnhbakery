import ProductsContext from '@/lib/contexts/productsContext';
import { SortListItem } from '@/lib/types/products';
import { Filter } from '@/pages/products';
import {
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@mui/material';
import { useContext } from 'react';

const initSortList = [
  { display: 'Mặc định', id: 0 },
  { display: 'Giá tăng dần', id: 1 },
  { display: 'Giá giảm dần', id: 2 },
  { display: 'A - Z', id: 3 },
  { display: 'Z - A', id: 4 },
  { display: 'Cũ nhất', id: 5 },
  { display: 'Mới nhất', id: 6 },
  { display: 'Bán chạy nhất', id: 7 },
];

function TypeSort({
  filter,
  handleChangeFilter,
}: {
  filter: Filter;
  handleChangeFilter: (
    type: 'price' | 'sizes' | 'colors' | 'productTypes_id' | 'sort',
    value: number | string | { min: number; max: number }
  ) => void;
}) {
  const theme = useTheme();
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
              value={filter.sort}
              onChange={(e) => handleChangeFilter('sort', e.target.value)}
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
              {initSortList.map(
                (item: { display: string; id: number }, i: number) => (
                  <MenuItem
                    key={i}
                    value={item.id}
                    sx={{
                      fontFamily: theme.typography.body2.fontFamily,
                      fontSize: theme.typography.body2.fontSize,
                      fontWeight: theme.typography.body2.fontWeight,
                    }}
                  >
                    {item.display}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
}

export default TypeSort;
