import { TableActionButton } from '@/components/buttons';
import { COLLECTION_NAME } from '@/lib/constants';
import { getCollection } from '@/lib/firestore';
import { SaleObject } from '@/lib/models';
import { Add, RestartAlt } from '@mui/icons-material';
import {
  Box,
  Divider,
  Grid,
  LinearProgress,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { SaleTable } from '../../components/sale/SaleTable';

export const CustomLinearProgres = styled(LinearProgress)(({ theme }) => ({
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const Sales = ({ saleData }: { saleData: string }) => {
  const [sales, setSales] = useState<SaleObject[]>([]);
  const theme = useTheme();

  useEffect(() => {
    const parsedSales = (JSON.parse(saleData) as SaleObject[]) ?? [];
    setSales(() => parsedSales);
  }, []);

  return (
    <>
      <Box width={'100%'} sx={{ p: 2, pr: 3, overflow: 'hidden' }}>
        <Grid
          container
          justifyContent={'center'}
          alignItems={'center'}
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography sx={{ color: theme.palette.common.black }} variant="h4">
              Quản lý khuyến mãi
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center',
                flexDirection: 'row',
                gap: 1,
              }}
            >
              <TableActionButton
                startIcon={<RestartAlt />}
                // onClick={handleReloadTable}
                sx={{
                  px: 2,
                }}
              >
                Tải lại
              </TableActionButton>

              <TableActionButton
                startIcon={<Add />}
                variant="contained"
                // onClick={handleNewRow}
              >
                Thêm
              </TableActionButton>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: 'italic' }}
            >
              *Tìm kiếm...
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <SaleTable sales={sales} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export const getServerSideProps = async () => {
  try {
    const sales = await getCollection<SaleObject>(COLLECTION_NAME.SALES);

    return {
      props: {
        saleData: JSON.stringify(sales),
      },
    };
  } catch (error) {
    console.log(error);

    return {
      props: {
        saleData: '',
      },
    };
  }
};
export default Sales;
