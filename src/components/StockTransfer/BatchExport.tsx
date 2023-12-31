import { db } from '@/firebase/config';
import { getBatchExchangesSnapshotById } from '@/lib/DAO/batchExchangeDAO';
import { createBatchExport } from '@/lib/DAO/batchExportDAO';
import { getBatchImportSnapshotById } from '@/lib/DAO/batchImportDAO';
import { getBranchById } from '@/lib/DAO/branchDAO';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import useBranches from '@/lib/hooks/useBranches';
import useProductTypeTableRows from '@/lib/hooks/useProductTypeTableRows';
import Batch, { batchConverter } from '@/models/batch';
import BatchExchange from '@/models/batchExchange';
import BatchExport, { batchExportConverter } from '@/models/batchExport';
import BatchImport, {
  ImportState,
  batchImportConverter,
} from '@/models/batchImport';
import Branch from '@/models/branch';
import Product from '@/models/product';
import { ProductTypeTableRow } from '@/models/productType';
import User from '@/models/user';
import { withHashCacheAsync } from '@/utils/withHashCache';
import {
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import {
  arrayUnion,
  collection,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { PropsWithChildren, useEffect, useMemo, useState } from 'react';

type BatchExportProps = {
  productTypeTableRows: ProductTypeTableRow[];
  branchId: string | undefined | null;
  userData: User | undefined | null;
};

export default function BatchExportTab({
  productTypeTableRows,
  branchId,
  userData,
}: BatchExportProps) {
  //#region Hooks

  const handleSnackbarAlert = useSnackbarService();

  //#endregion
  //#region Branches

  const branches = useBranches();

  //#endregion
  //#region Imports and Exports

  const [batchImports, setBatchImports] = useState<BatchImport[]>([]);
  const [batchExports, setBatchExports] = useState<BatchExport[]>([]);
  useEffect(() => {
    if (!branchId) {
      setBatchImports([]);
      return;
    }
    const importQuery = query(
      collection(db, COLLECTION_NAME.BATCH_IMPORTS),
      where('branch_id', '!=', branchId)
    ).withConverter(batchImportConverter);
    const exportQuery = query(
      collection(db, COLLECTION_NAME.BATCH_EXPORTS),
      where('branch_id', '==', branchId)
    ).withConverter(batchExportConverter);
    const importUnsub = onSnapshot(importQuery, (snapshot) => {
      if (snapshot.empty) {
        setBatchImports([]);
        return;
      } else {
        setBatchImports(
          snapshot.docs
            .map((doc) => doc.data())
            .filter((batchImport) => batchImport.state === 'issued')
        );
      }
    });
    const exportUnsub = onSnapshot(exportQuery, (snapshot) => {
      if (snapshot.empty) {
        setBatchExports([]);
        return;
      } else {
        setBatchExports(snapshot.docs.map((doc) => doc.data()));
      }
    });

    return () => {
      importUnsub();
      exportUnsub();
    };
  }, [branchId]);

  //#endregion
  //#region Import DataGrid

  const batchImportColumns: GridColDef[] = [
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

  // This hold ids
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);
  const [productType, product, variant] = useMemo(() => {
    let result = [null, null, null];

    const batchImport = batchImports.find(
      (batchImport) => batchImport.id === rowSelectionModel[0]
    );
    if (!batchImport) return result;

    const productType = productTypeTableRows.find(
      (productType) => productType.id === batchImport.product_type_id
    );
    if (!productType) return result;

    const product = productType.products?.find(
      (product) => product.id === batchImport.product_id
    );
    if (!product) return result;

    const variant = product.variants?.find(
      (variant) => variant.id === batchImport.variant_id
    );
    if (!variant) return result;

    return [productType, product, variant];
  }, [batchImports, productTypeTableRows, rowSelectionModel]);

  //#endregion
  //#region Branch batches

  const [branchBatches, setBranchBatches] = useState<Batch[]>([]);
  useEffect(() => {
    const branchBatchesQuery = query(
      collection(db, COLLECTION_NAME.BATCHES),
      where('branch_id', '==', branchId)
    ).withConverter(batchConverter);
    getDocs(branchBatchesQuery)
      .then((snapshot) => {
        if (snapshot.empty) setBranchBatches([]);
        else setBranchBatches(snapshot.docs.map((doc) => doc.data()));
      })
      .catch(() => setBranchBatches([]));
  }, [branchId]);
  const filteredBranchBatches = useMemo(() => {
    const selected = batchImports.find(
      (batchImport) => batchImport.id === rowSelectionModel[0]
    );
    if (!selected) return [];
    return branchBatches.filter(
      (batch) =>
        batch.product_type_id === productType?.id &&
        batch.product_id === product?.id &&
        batch.variant_id === variant?.id &&
        batch.quantity - batch.sold >= selected.quantity
    );
  }, [
    batchImports,
    branchBatches,
    product?.id,
    productType?.id,
    rowSelectionModel,
    variant?.id,
  ]);

  const branchBatchesColumns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
    },
    {
      field: 'sold',
      headerName: 'Đã bán',
      flex: 1,
    },
    {
      field: 'quantity',
      headerName: 'Số lượng',
      flex: 1,
    },
    {
      field: 'mfg',
      headerName: 'Sản xuất',
      valueFormatter(params) {
        return dayjs(params.value).format('HH:mm DD/MM/YYYY');
      },
      flex: 1,
    },
    {
      field: 'exp',
      headerName: 'Hết hạn',
      valueFormatter(params) {
        return dayjs(params.value).format('HH:mm DD/MM/YYYY');
      },
      flex: 1,
    },
  ];
  const [branchBatchSelectionModel, setBranchBatchSelectionModel] =
    useState<GridRowSelectionModel>([]);

  //#endregion
  //#region Action

  async function confirmBatchExport() {
    const selectedImport = batchImports.find(
      (batchImport) => batchImport.id === rowSelectionModel[0]
    );
    const selectedExportBatch = branchBatches.find(
      (batch) => batch.id === branchBatchSelectionModel[0]
    );
    if (!validate(selectedImport, selectedExportBatch)) return;

    const batchExport: Omit<BatchExport, 'id'> = {
      batch_id: selectedExportBatch!.id as string,
      state: 'pending',
      branch_id: branchId!,
      staff_id: userData!.id,
      staff_group_id: userData!.group_id,
      import_id: selectedImport!.id,
      quantity: selectedImport!.quantity,
      created_at: new Date(),
      updated_at: new Date(),
    };

    try {
      const exportRef = await createBatchExport(batchExport);
      const exchange = await getBatchExchangesSnapshotById(
        selectedImport?.branch_id as string
      );
      if (exchange.exists()) {
        await updateDoc(exchange.ref, {
          imports: arrayUnion(exportRef),
        });
      } else {
        await setDoc<Omit<BatchExchange, 'id'>>(exchange.ref, {
          imports: arrayUnion(exportRef),
          exports: [],
        });
      }
      const importRef = await getBatchImportSnapshotById(
        selectedImport?.id as string
      );
      await updateDoc(importRef.ref, { state: 'pending' });

      handleSnackbarAlert('success', 'Yêu cầu nhập lô bánh đã được tạo!');
    } catch {
      handleSnackbarAlert('warning', 'Yêu cầu nhập lô bánh không được tạo!');
    }
  }
  function validate(
    selectedImport: BatchImport | undefined | null,
    selectedExportBatch: Batch | undefined | null
  ): boolean {
    if (!selectedImport) {
      handleSnackbarAlert('warning', 'Vui lòng chọn loại bánh!');
      return false;
    }
    if (!selectedExportBatch) {
      handleSnackbarAlert('warning', 'Vui lòng chọn lô để xuất!');
      return false;
    }
    if (!branchId) {
      handleSnackbarAlert('warning', 'Thông tin chi nhánh bị sai!');
      return false;
    }
    if (!userData) {
      handleSnackbarAlert('warning', 'Thông tin quản lý bị sai!');
      return false;
    }
    return true;
  }

  //#endregion
  //#region Exports Datagrid

  const batchExportColumns: GridColDef[] = [
    {
      field: 'batch_id',
      headerName: 'ID Lô bánh',
      flex: 1,
    },
    {
      field: 'quantity',
      headerName: 'Số bánh',
      flex: 1,
    },
    {
      field: 'import_id',
      headerName: 'Chi nhánh nhập',
      valueFormatter(params) {
        const branch = branches.find((branch) => branch.id === params.value);
        return branch ? branch.name : 'Không xác định';
      },
      flex: 1,
    },
    {
      field: 'state',
      headerName: 'Trạng thái',
      flex: 1,
    },
  ];

  //#endregion
  //#region Tabs

  const [tab, setTab] = useState(0);

  //#endregion

  return (
    <>
      <Tabs
        centered
        value={tab}
        onChange={(_, value) => setTab(value)}
        textColor="secondary"
        indicatorColor="secondary"
      >
        <Tab label="Danh sách xuất hàng" />
        <Tab label="Nhận yêu cầu xuất hàng" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <Grid container p={4} gap={2}>
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 4 }}>
              <CardHeader
                title="Danh sách xuất hàng"
                titleTypographyProps={{ variant: 'h5' }}
              />
              <Divider />
              <CardContent>
                <DataGrid
                  rows={batchExports}
                  columns={batchExportColumns}
                  sx={{ height: 400 }}
                  rowSelectionModel={rowSelectionModel}
                  onRowSelectionModelChange={(rowSelectionModel) => {
                    setRowSelectionModel(rowSelectionModel);
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <Grid container p={4} gap={2}>
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
                  columns={batchImportColumns}
                  sx={{ height: 400 }}
                  rowSelectionModel={rowSelectionModel}
                  onRowSelectionModelChange={(rowSelectionModel) => {
                    setRowSelectionModel(rowSelectionModel);
                  }}
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
                <Grid container textAlign={'center'}>
                  {rowSelectionModel.length <= 0 ? (
                    <>
                      <Grid item xs={12}>
                        <Typography typography="h6" fontStyle={'italic'}>
                          Vui lòng chọn yêu càu nhập lô bánh!
                        </Typography>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid item xs={4}>
                        <Typography typography="body1">
                          {productType?.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography typography="body1">
                          {product?.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography typography="body1">
                          {variant?.material} - {variant?.size}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </CardContent>
              {rowSelectionModel.length > 0 && (
                <>
                  <Divider />
                  <CardContent>
                    {branchBatches.length <= 0 ? (
                      <Typography
                        typography="h6"
                        textAlign={'center'}
                        fontStyle={'italic'}
                      >
                        Chi nhánh không có lô bánh này
                      </Typography>
                    ) : (
                      <DataGrid
                        rows={filteredBranchBatches}
                        columns={branchBatchesColumns}
                        sx={{
                          height: 400,
                        }}
                        rowSelectionModel={branchBatchSelectionModel}
                        onRowSelectionModelChange={(rowSelectionModel) => {
                          setBranchBatchSelectionModel(rowSelectionModel);
                        }}
                      />
                    )}
                  </CardContent>
                </>
              )}
            </Card>
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="end">
            <Button
              variant="contained"
              color="secondary"
              onClick={confirmBatchExport}
            >
              Chấp nhận xuất hàng
            </Button>
          </Grid>
        </Grid>
      </TabPanel>
    </>
  );
}

function TabPanel({
  children,
  value,
  index,
}: PropsWithChildren<{ value: number; index: number }>) {
  return <>{value === index && children}</>;
}
