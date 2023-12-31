import { db } from '@/firebase/config';
import {
  createBatchImport,
  getBatchImportRefById,
} from '@/lib/DAO/batchImportDAO';
import { COLLECTION_NAME } from '@/lib/constants';
import { useSnackbarService } from '@/lib/contexts';
import BatchImport, {
  ImportState,
  batchImportConverter,
} from '@/models/batchImport';
import { ProductTypeTableRow } from '@/models/productType';
import User from '@/models/user';
import { Cancel } from '@mui/icons-material';
import {
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import {
  collection,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

type BatchImportProps = {
  productTypeTableRows: ProductTypeTableRow[];
  branchId: string | undefined | null;
  userData: User | undefined | null;
};
export default function BatchImport({
  productTypeTableRows,
  branchId,
  userData,
}: BatchImportProps) {
  //#region Other service hooks

  const handleSnackbarAlert = useSnackbarService();
  const router = useRouter();

  //#endregion
  //#region Items to select

  const [selectedProductTypeId, setSelectedProductTypeId] =
    useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');

  function handleSelectProductType(productTypeId: string) {
    setSelectedProductTypeId(productTypeId);
  }
  function handleSelectedProduct(productId: string) {
    setSelectedProductId(productId);
  }
  function handleSelectedVariant(variantId: string) {
    setSelectedVariantId(variantId);
  }

  const productTypes = useMemo(() => {
    return productTypeTableRows.filter((type) => type.active);
  }, [productTypeTableRows]);
  const products = useMemo(() => {
    return (
      productTypes
        .find((type) => type.id === selectedProductTypeId)
        ?.products?.filter((product) => product.active) || []
    );
  }, [productTypes, selectedProductTypeId]);
  const variants = useMemo(() => {
    return (
      products
        .find((product) => product.id === selectedProductId)
        ?.variants?.filter((variant) => variant.active) || []
    );
  }, [products, selectedProductId]);

  const [quantity, setQuantity] = useState(0);

  //#endregion
  //#region Confirmation Logics

  async function confirmImport() {
    const batchImport: Omit<BatchImport, 'id'> = {
      product_type_id: selectedProductTypeId,
      product_id: selectedProductId,
      variant_id: selectedVariantId,
      quantity: quantity,
      state: 'issued',
      branch_id: branchId as string,
      staff_group_id: userData?.group_id as string,
      staff_id: userData?.id as string,
      export_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    try {
      await createBatchImport(batchImport);
      handleSnackbarAlert('success', 'Yêu cầu nhập lô bánh đã được tạo!');
      clearForm();
    } catch {
      handleSnackbarAlert('warning', 'Yêu cầu nhập lô bánh không được tạo!');
    }
    setConfirmCreateImportDialogOpen(false);
  }
  function validate() {
    if (!selectedProductTypeId) {
      handleSnackbarAlert('warning', 'Vui lòng chọn loại bánh!');
      return false;
    }
    if (!selectedProductId) {
      handleSnackbarAlert('warning', 'Vui lòng chọn bánh!');
      return false;
    }
    if (!selectedVariantId) {
      handleSnackbarAlert('warning', 'Vui lòng chọn biến thể!');
      return false;
    }
    if (!quantity || quantity <= 0) {
      handleSnackbarAlert('warning', 'Vui lòng nhập số lượng!');
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
  function clearForm() {
    setSelectedProductTypeId('');
    setSelectedProductId('');
    setSelectedVariantId('');
    setQuantity(0);
  }

  //#endregion
  //#region Batch Imports data

  const [batchImports, setBatchImports] = useState<BatchImport[]>([]);
  const [refreshFlag, setRefreshFlag] = useState(0);
  useEffect(() => {
    if (!branchId) {
      return;
    }
    const batchImportsQuery = query(
      collection(db, COLLECTION_NAME.BATCH_IMPORTS).withConverter(
        batchImportConverter
      ),
      where('branch_id', '==', branchId)
    );
    const unSub = onSnapshot(batchImportsQuery, (snapshot) => {
      if (snapshot.empty) {
        setBatchImports([]);
      } else {
        const docs = snapshot.docs.map((doc) => {
          return doc.data();
        });
        setBatchImports(docs);
      }
    });

    return () => unSub();
  }, [branchId, refreshFlag]);

  //#endregion
  //#region Datagrid

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
    {
      flex: 1,
      field: 'actions',
      type: 'actions',
      getActions(params) {
        return [
          <Button
            key="cancel"
            variant="contained"
            color="secondary"
            startIcon={<Cancel />}
            disabled={(
              ['pending', 'success', 'cancel'] as ImportState[]
            ).includes(params.row.state)}
            onClick={() => alertCancelImport(params.row.id as string)}
          >
            Hủy
          </Button>,
        ];
      },
    },
  ];
  function alertCancelImport(id: string) {
    setCancelDialogOpen(true);
    setCancelingImportId(id);
  }

  //#endregion
  //#region Event handlers

  async function handleCancelImport(id: string) {
    if (!id) return;
    try {
      await updateDoc(getBatchImportRefById(id), { state: 'cancel' });
      handleSnackbarAlert('success', 'Hủy yêu cầu nhập lô bánh thành công!');
      setRefreshFlag((prev) => prev + 1);
    } catch {
      handleSnackbarAlert('warning', 'Hủy yêu cầu nhập lô bánh thất bại!');
    } finally {
      setCancelDialogOpen(false);
      setCancelingImportId('');
    }
  }

  //#endregion
  //#region Dialogs

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelingImportId, setCancelingImportId] = useState('');
  function handleCancelDialogClose() {
    setCancelDialogOpen(false);
  }

  const [confirmCreateImportDialogOpen, setConfirmCreateImportDialogOpen] =
    useState(false);
  function handleConfirmImportDialog() {
    if (!validate()) return;
    setConfirmCreateImportDialogOpen(true);
  }

  //#endregion

  return (
    <>
      <Grid container p={4} gap={2}>
        <Grid item xs={12} display="flex" alignItems="center" gap={1}>
          <Breadcrumbs aria-label="breadcrumb">
            <Typography color="text.primary"> Lưu thông chi nhánh</Typography>
            <Typography color="text.primary">Nhập lô bánh</Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 4 }}>
            <CardHeader
              title="Chọn sản phẩm"
              titleTypographyProps={{
                typography: 'h5',
              }}
            />
            <Divider />
            <CardContent>
              <Grid container columnSpacing={1}>
                <Grid item xs={4}>
                  <Typography typography="h6">Loại bánh</Typography>
                  <Select
                    value={selectedProductTypeId}
                    onChange={(e) =>
                      handleSelectProductType(e.target.value || '')
                    }
                    fullWidth
                    placeholder="Loại bánh"
                    color="secondary"
                    displayEmpty
                  >
                    <MenuItem value="">Chọn loại bánh</MenuItem>
                    {productTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={4}>
                  <Typography typography="h6">Bánh</Typography>
                  <Select
                    value={selectedProductId}
                    onChange={(e) =>
                      handleSelectedProduct(e.target.value || '')
                    }
                    fullWidth
                    placeholder="Bánh"
                    color="secondary"
                    displayEmpty
                  >
                    <MenuItem key="default" value="">
                      Chọn bánh
                    </MenuItem>
                    {products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={4}>
                  <Typography typography="h6">Biến thể</Typography>
                  <Select
                    value={selectedVariantId}
                    onChange={(e) =>
                      handleSelectedVariant(e.target.value || '')
                    }
                    fullWidth
                    placeholder="Biến thể"
                    color="secondary"
                    displayEmpty
                  >
                    <MenuItem value="">Chọn biến thể</MenuItem>
                    {variants.map((variant) => (
                      <MenuItem key={variant.id} value={variant.id}>
                        {variant.material} - {variant.size}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <CardContent>
              <Typography typography="h6">Số lượng bánh</Typography>
              <TextField
                type="number"
                placeholder="Số lượng bánh"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </CardContent>
            <Divider />
            <CardContent
              sx={{ display: 'flex', justifyContent: 'end', gap: 1 }}
            >
              <Button
                color="secondary"
                variant="contained"
                size="large"
                onClick={() => handleConfirmImportDialog()}
              >
                Xác nhận
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 4 }}>
            <CardHeader
              title="Chọn sản phẩm"
              titleTypographyProps={{
                typography: 'h5',
              }}
            />
            <Divider />
            <CardContent>
              <DataGrid
                rows={batchImports}
                columns={columns}
                sx={{
                  height: 400,
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Dialog tạo yêu cầu */}
      <Dialog
        open={confirmCreateImportDialogOpen}
        onClose={() => setConfirmCreateImportDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
          },
        }}
      >
        <DialogTitle>Tạo yêu cầu nhập lô bánh</DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText>
            Xác nhận tạo yêu cầu nhập lô bánh?
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            onClick={() => confirmImport()}
            variant="contained"
            color="secondary"
          >
            Xác nhận
          </Button>
          <Button
            onClick={() => setConfirmCreateImportDialogOpen(false)}
            variant="contained"
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog hủy yêu cầu */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
          },
        }}
      >
        <DialogTitle>Hủy yêu cầu</DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText>
            Bạn có chắc muốn hủy yêu cầu nhập lô bánh?
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            onClick={() => handleCancelImport(cancelingImportId)}
            variant="contained"
            color="secondary"
          >
            Hủy yêu cầu
          </Button>
          <Button onClick={handleCancelDialogClose} variant="contained">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
