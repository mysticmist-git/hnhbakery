import { formatPrice } from '@/lib/utils';
import { MainTabData } from '@/pages/manager/reports';
import { ChevronRight } from '@mui/icons-material';
import { Card, Divider, Grid, IconButton, Typography } from '@mui/material';

type MainTabProps = {
  data: MainTabData;
  onClickRevenueTab: () => void;
  onClickBatchTab: () => void;
};

export default function MainTab({
  data,
  onClickRevenueTab,
  onClickBatchTab,
}: MainTabProps) {
  return (
    <>
      <Grid item xs={6}>
        <Card
          elevation={4}
          sx={{
            borderRadius: 4,
            display: 'flex',
          }}
        >
          <Grid container>
            <Grid item xs={6} textAlign={'center'} pl={4} pt={4}>
              <Typography typography="h5">Tổng doanh thu</Typography>
              <Typography color="success.main">
                {formatPrice(data.revenue.totalRevenue)}
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="center" pr={4} pt={4}>
              <Typography typography="h5">Tiền đã khuyến mãi</Typography>
              <Typography color="error.main">
                {formatPrice(-data.revenue.saleAmount)}
              </Typography>
            </Grid>
            <Grid item xs={12} py={1}>
              <Divider />
            </Grid>
            <Grid item xs={12} textAlign={'center'} px={4} pb={4}>
              <Typography typography="h5">Doanh thu thực sự</Typography>
              <Typography color="success.main">
                {formatPrice(data.revenue.finalRevenue)}
              </Typography>
            </Grid>
          </Grid>
          <Divider orientation="vertical" flexItem />
          <IconButton sx={{ borderRadius: 0 }} onClick={onClickRevenueTab}>
            <ChevronRight />
          </IconButton>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card
          elevation={4}
          sx={{
            borderRadius: 4,
            display: 'flex',
          }}
        >
          <Grid container>
            <Grid item xs={12} textAlign="center" px={4} pt={4}>
              <Typography typography="h5">Lô bánh làm ra</Typography>
              <Typography>{data.batch.totalBatch}</Typography>
            </Grid>
            <Grid item xs={12} py={1}>
              <Divider />
            </Grid>
            <Grid item xs={6} textAlign={'center'} pl={4} pb={4}>
              <Typography typography="h5">Lô bánh đã bán</Typography>
              <Typography color="success.main">
                {data.batch.soldBatch}
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign={'center'} pr={4} pb={4}>
              <Typography typography="h5">Lô bánh hết hạn</Typography>
              <Typography color="error.main">
                {data.batch.expiredBatch}
              </Typography>
            </Grid>
          </Grid>
          <Divider orientation="vertical" flexItem />
          <IconButton sx={{ borderRadius: 0 }} onClick={onClickBatchTab}>
            <ChevronRight />
          </IconButton>
        </Card>
      </Grid>
    </>
  );
}
