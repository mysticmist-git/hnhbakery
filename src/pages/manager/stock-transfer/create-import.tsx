import { auth } from '@/firebase/config';
import { getBranchByManager } from '@/lib/DAO/branchDAO';
import { getProductTypeTableRows } from '@/lib/DAO/productTypeDAO';
import { getUserByUid } from '@/lib/DAO/userDAO';
import { useSnackbarService } from '@/lib/contexts';
import Product, { ProductTableRow } from '@/models/product';
import { ProductTypeTableRow } from '@/models/productType';
import StockImport from '@/models/stockImport';
import User from '@/models/user';
import { VariantTableRow } from '@/models/variant';
import { withHashCacheAsync } from '@/utils/withHashCache';
import { ArrowLeft } from '@mui/icons-material';
import {
  Autocomplete,
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
import { onAuthStateChanged } from 'firebase/auth';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { types } from 'util';

export default function CreateImport() {
  //#region Other service hooks

  const handleSnackbarAlert = useSnackbarService();
  const router = useRouter();

  //#endregion
  //#region Client Authorization

  const [userData, setUserData] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUserData(null);
        return;
      }

      getUserByUid(user.uid)
        .then((user) => setUserData(user ?? null))
        .catch(() => setUserData(null));
    });

    return () => {
      unsubscribe();
    };
  }, [handleSnackbarAlert]);

  const [canBeAccessed, setCanBeAccessed] = useState<boolean | undefined>();
  useEffect(() => {
    async function checkUserAccess(userData: User): Promise<boolean> {
      try {
        const branch = await getBranchByManager(userData);

        if (!branch) {
          setCanBeAccessed(false);
          return false;
        }
        setCanBeAccessed(true);
        return true;
      } catch {
        setCanBeAccessed(false);
        return true;
      }
    }
    async function fetchData() {}

    if (!userData) {
      return;
    }

    checkUserAccess(userData)
      .then((canAccess) => {
        if (canAccess) fetchData();
      })
      .catch((canAccess) => {
        if (canAccess) fetchData();
      });
  }, [userData]);

  //#endregion

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

  function confirmImport() {}

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
            <TextField type="number" placeholder="Số lượng bánh" />
          </CardContent>
          <Divider />
          <CardContent sx={{ display: 'flex', justifyContent: 'end', gap: 1 }}>
            <Button variant="contained" size="large">
              Hủy
            </Button>
            <Button color="secondary" variant="contained" size="large">
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
