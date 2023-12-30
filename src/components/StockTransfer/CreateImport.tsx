import { db } from '@/firebase/config';
import {
  getBatchExchangeRefById,
  getBatchExchangesSnapshotById,
} from '@/lib/DAO/batchExchangeDAO';
import {
  createBatchImport,
  getBatchImportRefById,
} from '@/lib/DAO/batchImportDAO';
import { getProductTypeTableRows } from '@/lib/DAO/productTypeDAO';
import { useSnackbarService } from '@/lib/contexts';
import BatchExchange from '@/models/batchExchange';
import BatchImport, {
  ImportState,
  batchImportConverter,
} from '@/models/batchImport';
import { ProductTypeTableRow } from '@/models/productType';
import User from '@/models/user';
import { withHashCacheAsync } from '@/utils/withHashCache';
import { ArrowLeft, Cancel, Delete } from '@mui/icons-material';
import {
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridActionsCell,
  GridActionsCellItem,
  GridColDef,
} from '@mui/x-data-grid';
import dayjs from 'dayjs';
import {
  FieldValue,
  arrayUnion,
  getDoc,
  onSnapshot,
  runTransaction,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

type CreateImportProps = {
  branchId: string | undefined | null;
  userData: User | undefined | null;
};
export default function CreateBatchImport({
  branchId,
  userData,
}: CreateImportProps) {
  //#region Other service hooks

  const handleSnackbarAlert = useSnackbarService();
  const router = useRouter();

  //#endregion
  //#region Items to select

  const [productTypesTableRows, setProductTypeTableRows] = useState<
    ProductTypeTableRow[]
  >([]);
  useEffect(() => {
    cachedGetProductTypeTableRows()
      .then((types) => setProductTypeTableRows(types || []))
      .catch(() => setProductTypeTableRows([]));
  }, []);

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
    return productTypesTableRows.filter((type) => type.active);
  }, [productTypesTableRows]);
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
    if (!validate()) return;

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
      const importRef = await createBatchImport(batchImport);
      const exchange = await getBatchExchangesSnapshotById(branchId as string);
      if (exchange.exists()) {
        await updateDoc(exchange.ref, {
          imports: arrayUnion(importRef),
        });
      } else {
        await setDoc<Omit<BatchExchange, 'id'>>(exchange.ref, {
          imports: arrayUnion(importRef),
          exports: [],
        });
      }

      handleSnackbarAlert('success', 'Yêu cầu nhập lô bánh đã được tạo!');
      clearForm();
    } catch {
      handleSnackbarAlert('warning', 'Yêu cầu nhập lô bánh không được tạo!');
    }
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

  const [exchange, setExchange] = useState<BatchExchange | null>(null);
  useEffect(() => {
    if (!branchId) {
      setExchange(null);
      return;
    }
    const unsub = onSnapshot(
      getBatchExchangeRefById(branchId as string),
      (doc) => {
        doc.exists()
          ? setExchange(doc.data() as BatchExchange)
          : setExchange(null);
      }
    );
    return () => unsub();
  }, [branchId]);
  const [batchImports, setBatchImports] = useState<BatchImport[]>([]);
  const [refreshFlag, setRefreshFlag] = useState(0);
  useEffect(() => {
    async function fetchBatchImports() {
      if (!exchange) {
        setBatchImports([]);
        return;
      }
      let imports: BatchImport[] = [];
      await runTransaction(db, async (transaction) => {
        await Promise.all(
          exchange.imports.map(async (importRef) => {
            const snapshot = await transaction.get(
              importRef.withConverter(batchImportConverter)
            );
            if (snapshot.exists()) {
              imports.push(snapshot.data() as BatchImport);
            }
          })
        );
      });
      imports = imports.sort((a, b) =>
        dayjs(a.created_at).isBefore(dayjs(b.created_at)) ? 1 : -1
      );
      setBatchImports(imports);
    }
    fetchBatchImports();
  }, [exchange, refreshFlag]);

  //#endregion
  //#region Datagrid

  const columns: GridColDef[] = [
    {
      flex: 1,
      field: 'product_type_id',
      headerName: 'Loại bánh',
      valueFormatter(params) {
        const productType = productTypesTableRows.find(
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
        const product = productTypesTableRows
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
        const variant = productTypesTableRows
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
          <GridActionsCellItem
            key="cancel"
            icon={<Cancel />}
            label="Hủy"
            disabled={(
              ['pending', 'success', 'cancel'] as ImportState[]
            ).includes(params.row.state)}
            onClick={() => handleCancelImport(params.id as string)}
          />,
        ];
      },
    },
  ];

  //#endregion
  //#region Event handlers

  async function handleCancelImport(id: string) {
    try {
      await updateDoc(getBatchImportRefById(id), { state: 'cancel' });
      handleSnackbarAlert('success', 'Hủy yêu cầu nhập lô bánh thành công!');
      setRefreshFlag((prev) => prev + 1);
    } catch {
      handleSnackbarAlert('warning', 'Hủy yêu cầu nhập lô bánh thất bại!');
    }
  }

  //#endregion

  return (
    <Grid container p={4} gap={2}>
      <Grid item xs={12} display="flex" alignItems="center" gap={1}>
        <NextLink href={'/manager/stock-transfer'}>
          <IconButton
            sx={{
              borderRadius: 2,
              color: 'white',
              backgroundColor: 'secondary.main',
              ':hover': {
                backgroundColor: 'secondary.dark',
              },
            }}
          >
            <ArrowLeft />
          </IconButton>
        </NextLink>
        <Breadcrumbs aria-label="breadcrumb">
          <NextLink href={'/manager/stock-transfer'} passHref legacyBehavior>
            <Link underline="hover" color="inherit">
              Lưu thông chi nhánh
            </Link>
          </NextLink>
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
                  onChange={(e) => handleSelectedProduct(e.target.value || '')}
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
                  onChange={(e) => handleSelectedVariant(e.target.value || '')}
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
          <CardContent sx={{ display: 'flex', justifyContent: 'end', gap: 1 }}>
            <Button variant="contained" size="large">
              Hủy
            </Button>
            <Button
              color="secondary"
              variant="contained"
              size="large"
              onClick={confirmImport}
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
            <DataGrid rows={batchImports} columns={columns} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

const cachedGetProductTypeTableRows = withHashCacheAsync(
  getProductTypeTableRows
);
