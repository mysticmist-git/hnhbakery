import { db } from '@/firebase/config';
import { COLLECTION_NAME } from '@/lib/constants';
import BatchExport from '@/models/batchExport';
import BatchImport, {
  ImportState,
  batchImportConverter,
} from '@/models/batchImport';
import { ProductTypeTableRow } from '@/models/productType';
import User from '@/models/user';
import {
  Breadcrumbs,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

type BatchExportProps = {
  productTypeTableRows: ProductTypeTableRow[];
  branchId: string | undefined | null;
  userData: User | undefined | null;
};
export default function BatchExport({
  productTypeTableRows,
  branchId,
  userData,
}: BatchExportProps) {
  //#region Imports

  const [batchImports, setBatchImports] = useState<BatchImport[]>([]);
  useEffect(() => {
    if (!branchId) {
      setBatchImports([]);
      return;
    }
    const importQuery = query(
      collection(db, COLLECTION_NAME.BATCH_IMPORTS),
      where('branch_id', '!=', branchId)
    ).withConverter(batchImportConverter);
    getDocs(importQuery)
      .then((snapshot) => {
        if (snapshot.empty) {
          setBatchImports([]);
          return;
        } else {
          setBatchImports(snapshot.docs.map((doc) => doc.data()));
        }
      })
      .catch((err) => console.log(err));
  }, [branchId]);

  //#endregion
  //#region DataGrid

  const columns: GridColDef[] = [
    {
      flex: 1,
      field: 'product_type_id',
      headerName: 'Loại bánh',
      valueFormatter(params) {
        const productType = productTypeTableRows.find(
          (productType) => productType.id === params.value
        );
        if (productType) {
          return productType.name;
        }
        return '';
      },
    },
    {
      flex: 1,
      field: 'product_id',
      headerName: 'Bánh',
      valueFormatter(params) {
        const productTypeId = params.api.getRow(params.id!).product_type_id;
        const product = productTypeTableRows
          .find((type) => type.id === productTypeId)
          ?.products?.find((product) => product.id === params.value);
        if (product) {
          return product.name;
        }
        return '';
      },
    },
    {
      flex: 1,
      field: 'variant_id',
      headerName: 'Biến thể',
      valueFormatter(params) {
        const { product_type_id, product_id } = params.api.getRow(params.id!);
        const variant = productTypeTableRows
          .find((type) => type.id === product_type_id)
          ?.products?.find((product) => product.id === product_id)
          ?.variants?.find((variant) => variant.id === params.value);
        if (variant) {
          return `${variant.material} - ${variant.size}`;
        }
        return '';
      },
    },
    {
      flex: 1,
      field: 'quantity',
      headerName: 'Số lượng',
    },

    {
      flex: 1,
      field: 'state',
      headerName: 'Trạng thái',
      renderCell(params) {
        switch (params.value as ImportState) {
          case 'issued':
            return <Typography typography="body2">Đã tạo</Typography>;
          case 'pending':
            return (
              <Typography typography="body2" color="info.main">
                Đang nhập
              </Typography>
            );
          case 'cancel':
            return (
              <Typography typography="body2" color="error.main">
                Đã hủy
              </Typography>
            );
          case 'success':
            return (
              <Typography typography="body2" color="success.main">
                Thành công
              </Typography>
            );
          default:
            return (
              <Typography typography="body2" color="warning.main">
                Không xác định
              </Typography>
            );
        }
      },
    },
    {
      flex: 1,
      field: 'created_at',
      headerName: 'Thời gian tạo',
      valueFormatter(params) {
        return dayjs(params.value).format('HH:mm DD/MM/YYYY');
      },
    },
  ];

  //#endregion

  console.log(batchImports);

  return (
    <>
      <Grid container p={4} gap={2}>
        <Grid item xs={12} display="flex" alignItems="center" gap={1}>
          <Breadcrumbs aria-label="breadcrumb">
            <Typography color="text.primary"> Lưu thông chi nhánh</Typography>
            <Typography color="text.primary">Xuất lô bánh</Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 4 }}>
            <CardHeader
              title="Yêu cầu nhập lô bánh"
              titleTypographyProps={{ variant: 'h5' }}
            />
            <Divider />
            <CardContent>
              <DataGrid
                rows={batchImports}
                columns={columns}
                sx={{ height: 400 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 4 }}>
            <CardHeader
              title="Lô bánh xuất"
              titleTypographyProps={{ variant: 'h5' }}
            />
            <Divider />
            <CardContent>
              <Typography>Chi nhánh không có lô bánh này</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
