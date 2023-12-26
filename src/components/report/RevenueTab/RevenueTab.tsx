import { getDownloadUrlFromFirebaseStorage } from '@/lib/firestore';
import useBranches from '@/lib/hooks/useBranches';
import {
  ProductRevenue,
  VariantRevenue,
  getBranchRevenueData,
  getProductTypeRevenueData,
  getRevenueTabChartData,
} from '@/lib/pageSpecific/report';
import { Interval, IntervalType } from '@/lib/types/report';
import { formatPrice } from '@/lib/utils';
import { BillTableRow } from '@/models/bill';
import Branch from '@/models/branch';
import { ChevronLeft, KeyboardArrowDown } from '@mui/icons-material';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ChartData, ChartOptions } from 'chart.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';

function resolveRevenueChartLabels(
  intervalType: IntervalType,
  data: number[]
): string[] {
  switch (intervalType) {
    case 'week':
      return [
        'Chủ nhật',
        'Thứ hai',
        'Thứ ba',
        'Thứ tư',
        'Thứ năm',
        'Thứ sáu',
        'Thứ bảy',
      ];
    case 'month':
      return data.map((_, index) => `Ngày ${index + 1}`);
    case 'year':
      return [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
      ];
    default:
      return [];
  }
}

type RevenueTabProps = {
  interval: Interval;
  billTableRows: BillTableRow[];
  onClickBack(): void;
};

export default function RevenueTab({
  interval,
  billTableRows,
  onClickBack,
}: RevenueTabProps) {
  const branches = useBranches();
  const data: number[] = useMemo(() => {
    return getRevenueTabChartData(billTableRows, interval);
  }, [billTableRows, interval]);
  const branchData = useMemo(() => {
    return billTableRows.length > 0 ? getBranchRevenueData(billTableRows) : {};
  }, [billTableRows]);
  const productTypeRevenueData = useMemo(() => {
    return billTableRows.length > 0
      ? getProductTypeRevenueData(billTableRows)
      : {};
  }, [billTableRows]);

  const revenueChartData: ChartData<'line', number[], string> = useMemo(
    () => ({
      labels: resolveRevenueChartLabels(interval.type, data),
      datasets: [
        {
          data: data,
        },
      ],
    }),
    [data, interval.type]
  );
  const revenueChartOptions: ChartOptions<'line'> = useMemo(
    () => ({
      scales: {
        y: {
          ticks: {
            callback: (value) => {
              return `${value} VNĐ`;
            },
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Biểu đồ đường Doanh thu tháng',
          font: {
            size: 20,
          },
        },
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return `${context.parsed.y} VNĐ`;
            },
          },
        },
      },
    }),
    []
  );
  const branchChartData: ChartData<'pie', number[], string> = useMemo(() => {
    const entries = Object.entries(branchData);
    return {
      labels: entries.map(
        (e) => branches.find((b) => b.id === e[0])?.name ?? 'Không xác định'
      ),
      datasets: [
        {
          label: '% Doanh thu',
          data: entries.map((entry) => entry[1].percent),
          backgroundColor: entries.map(
            () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
          ),
        },
      ],
    };
  }, [branchData, branches]);
  const productTypeChartData: ChartData<'pie', number[], string> =
    useMemo(() => {
      const entries = Object.entries(productTypeRevenueData);
      return {
        labels: entries.map((entry) => entry[1].name),
        datasets: [
          {
            label: '% Doanh thu',
            data: entries.map((entry) => entry[1].percent),
            backgroundColor: entries.map(
              () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
            ),
          },
        ],
      };
    }, [productTypeRevenueData]);
  const branchChartOptions: ChartOptions<'pie'> = useMemo(
    () => ({
      plugins: {
        title: {
          display: true,
          text: 'Tỉ lệ Doanh thu chi nhánh',
          font: {
            size: 20,
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return `${context.parsed}%`;
            },
          },
        },
      },
    }),
    []
  );
  const productTypeChartOptions: ChartOptions<'pie'> = useMemo(
    () => ({
      plugins: {
        title: {
          display: true,
          text: 'Tỉ lệ Doanh thu sản phẩm',
          font: {
            size: 20,
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return `${context.parsed}%`;
            },
          },
        },
      },
    }),
    []
  );

  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const datagridRows = useMemo(() => {
    const rows: { id: string; label: string; data: number }[] = [];
    const labels = resolveRevenueChartLabels(interval.type, data);
    for (let i = 0; i < labels.length; i++) {
      rows.push({
        id: (i + 1).toString(),
        label: labels[i],
        data: data[i],
      });
    }
    return rows;
  }, [data, interval.type]);
  const datagridColumns: GridColDef[] = useMemo(() => {
    let label = '';
    switch (interval.type) {
      case 'week':
        label = 'Tuần';
        break;
      case 'month':
        label = 'Tháng';
        break;
      case 'year':
        label = 'Năm';
        break;
    }
    const columns: GridColDef[] = [
      {
        field: 'label',
        headerName: label,
        flex: 1,
      },
      {
        field: 'data',
        headerName: 'Doanh thu',
        flex: 1,
        valueFormatter: (params) => {
          return formatPrice(params.value);
        },
      },
    ];
    return columns;
  }, [interval.type]);

  return (
    <>
      <Grid item xs={12} display={'flex'} alignItems={'center'} gap={1}>
        <IconButton
          sx={{
            borderRadius: 2,
            color: 'white',
            backgroundColor: 'secondary.main',
            ':hover': {
              backgroundColor: 'secondary.dark',
            },
          }}
          onClick={onClickBack}
        >
          <ChevronLeft />
        </IconButton>
        <Divider orientation="vertical" flexItem />
        <Typography
          typography="h6"
          sx={{
            cursor: 'default',
            transition: '0.2s ease-in-out',
            ':hover': {
              transform: 'scale(1.1)',
              color: 'secondary.main',
              translate: '10%',
            },
          }}
        >
          Doanh thu
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <ButtonGroup>
          <Button
            variant="contained"
            color={viewMode === 'chart' ? 'secondary' : 'primary'}
            onClick={() => setViewMode('chart')}
          >
            Biểu đồ
          </Button>
          <Button
            variant="contained"
            color={viewMode === 'table' ? 'secondary' : 'primary'}
            onClick={() => setViewMode('table')}
          >
            Bảng
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 4, p: 2 }}>
          {viewMode === 'chart' ? (
            <Line data={revenueChartData} options={revenueChartOptions} />
          ) : (
            <DataGrid
              rows={datagridRows}
              columns={datagridColumns}
              sx={{ minHeight: 240 }}
            />
          )}
        </Card>
      </Grid>
      {/* Theo chi nhánh */}
      <Grid item xs={7}>
        <Card sx={{ borderRadius: 4 }}>
          <Box component={'div'} p={2}>
            <Typography typography="h6">Doanh thu theo chi nhánh</Typography>
          </Box>
          <Divider />
          <Box component={'div'}>
            <List>
              <ListItem>
                <ListItemText primary="Tổng doanh thu" />
                <ListItemText
                  primary={formatPrice(
                    Object.entries(branchData).reduce(
                      (acc, key) => acc + key[1].revenue,
                      0
                    )
                  )}
                />
              </ListItem>
              <Divider />
            </List>
            <List sx={{ overflow: 'auto', maxHeight: 400 }}>
              {Object.entries(branchData).map((entry, index) => (
                <BranchRevenueItem
                  key={index}
                  branch={branches.find((b) => b.id === entry[0])}
                  data={entry[1]}
                />
              ))}
            </List>
          </Box>
        </Card>
      </Grid>
      <Grid item xs={5} sx={{ borderRadius: 4 }}>
        <Card sx={{ borderRadius: 4, height: '100%', p: 4 }}>
          <Pie data={branchChartData} options={branchChartOptions} />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      {/* Theo sản phẩm */}
      <Grid item xs={7}>
        <Card sx={{ borderRadius: 4 }}>
          <Box p={2}>
            <Typography typography="h6">Doanh thu theo sản phẩm</Typography>
          </Box>
          <Divider />
          <Box>
            <List>
              <ListItem>
                <ListItemText primary="Tổng doanh thu" />
                <ListItemText
                  primary={formatPrice(
                    Object.values(branchData).reduce(
                      (acc, value) => acc + value.revenue,
                      0
                    )
                  )}
                />
              </ListItem>
              <Divider />
            </List>
            <List sx={{ overflowY: 'auto', maxHeight: 800 }}>
              {Object.entries(productTypeRevenueData).map((entry, index) => (
                <ProductTypeRevenueItem
                  key={index}
                  name={entry[1].name}
                  image={entry[1].image}
                  revenue={entry[1].revenue}
                  percent={entry[1].percent}
                  products={entry[1].products}
                />
              ))}
            </List>
          </Box>
        </Card>
      </Grid>
      <Grid item xs={5} sx={{ borderRadius: 4 }}>
        <Card sx={{ borderRadius: 4, height: 560, p: 4 }}>
          <Pie data={productTypeChartData} options={productTypeChartOptions} />
        </Card>
      </Grid>
    </>
  );
}

function BranchRevenueItem({
  branch,
  data,
}: {
  branch?: Branch;
  data: { revenue: number; percent: number };
}) {
  return branch ? (
    <ListItem>
      <ListItemText
        primary={`Chi nhánh ${branch.name}`}
        secondary={`Địa chỉ chi nhánh ${branch.address}`}
      />
      <Divider orientation="vertical" />
      <ListItemText
        primary={`${formatPrice(data.revenue)} (${data.percent}%)`}
      />
    </ListItem>
  ) : (
    <p>null branch</p>
  );
}

function ProductTypeRevenueItem({
  name,
  image,
  revenue,
  percent,
  products,
}: {
  name: string;
  image: string;
  revenue: number;
  percent: number;
  products: ProductRevenue;
}) {
  const [img, setImg] = useState('');
  useEffect(() => {
    getDownloadUrlFromFirebaseStorage(image).then((url) => setImg(url));
  }, [image]);

  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(
    (value?: boolean) => {
      value ? setOpen(value) : setOpen(!open);
    },
    [open]
  );

  return (
    <>
      <ListItemButton onClick={() => toggleOpen()}>
        <Box
          component="img"
          src={img}
          width={100}
          height={100}
          borderRadius={4}
          sx={{
            objectFit: 'cover',
            mr: 4,
          }}
        />
        <ListItemText primary={name} />
        <ListItemText
          primary={formatPrice(revenue)}
          secondary={`${percent}%`}
        />
        {/* toggle icon */}
        <KeyboardArrowDown
          sx={{
            mr: 2,
            transform: open ? 'rotate(-180deg)' : 'rotate(0)',
            transition: '0.2s',
          }}
        />
      </ListItemButton>
      {open &&
        Object.entries(products).map((entry, index) => (
          <ProductRevenueItem key={index} {...entry[1]} />
        ))}
    </>
  );
}

function ProductRevenueItem({
  name,
  image,
  revenue,
  percent,
  variants,
}: {
  name: string;
  image: string;
  revenue: number;
  percent: number;
  variants: VariantRevenue;
}) {
  const [img, setImg] = useState('');
  useEffect(() => {
    getDownloadUrlFromFirebaseStorage(image).then((url) => setImg(url));
  }, [image]);

  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(
    (value?: boolean) => {
      value ? setOpen(value) : setOpen(!open);
    },
    [open]
  );

  return (
    <>
      <ListItemButton onClick={() => toggleOpen()}>
        <Box
          component="img"
          src={img}
          width={100}
          height={100}
          borderRadius={4}
          sx={{
            objectFit: 'cover',
            mr: 4,
            ml: 4,
          }}
        />
        <ListItemText primary={name} />
        <ListItemText
          primary={formatPrice(revenue)}
          secondary={`${percent}%`}
        />
        {/* toggle icon */}
        <KeyboardArrowDown
          sx={{
            mr: 2,
            transform: open ? 'rotate(-180deg)' : 'rotate(0)',
            transition: '0.2s',
          }}
        />
      </ListItemButton>
      {open &&
        Object.values(variants).map((value, index) => (
          <ListItem key={index} sx={{ ml: 8 }}>
            <ListItemText primary={value.material} secondary={value.size} />
            <ListItemText
              primary={formatPrice(value.revenue)}
              secondary={`${value.percent}%`}
            />
          </ListItem>
        ))}
    </>
  );
}
