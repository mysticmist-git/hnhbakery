import { getProductTypeTableRows } from '@/lib/DAO/productTypeDAO';
import { useSnackbarService } from '@/lib/contexts';
import { ProductTypeTableRow } from '@/models/productType';
import StockImport from '@/models/stockImport';
import User from '@/models/user';
import { withHashCacheAsync } from '@/utils/withHashCache';
import { ArrowLeft } from '@mui/icons-material';
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
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

type CreateImportProps = {
  branchId: string | undefined | null;
  userData: User | undefined | null;
};
export default function CreateImport({
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

  function confirmImport() {
    if (!validate()) return;
    const stockImport: Omit<StockImport, 'id'> = {
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
    console.log(stockImport);
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
    </Grid>
  );
}

const cachedGetProductTypeTableRows = withHashCacheAsync(
  getProductTypeTableRows
);
