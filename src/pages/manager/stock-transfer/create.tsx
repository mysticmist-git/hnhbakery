import { auth } from '@/firebase/config';
import { getBatches } from '@/lib/DAO/batchDAO';
import { getBranchByManager } from '@/lib/DAO/branchDAO';
import { getProduct } from '@/lib/DAO/productDAO';
import { getProductTypeById } from '@/lib/DAO/productTypeDAO';
import { getUserByUid } from '@/lib/DAO/userDAO';
import { getVariant } from '@/lib/DAO/variantDAO';
import { useSnackbarService } from '@/lib/contexts';
import Batch from '@/models/batch';
import Branch from '@/models/branch';
import Product from '@/models/product';
import ProductType from '@/models/productType';
import User from '@/models/user';
import Variant from '@/models/variant';
import {
  ArrowLeft,
  Circle,
  KeyboardArrowDown,
  KeyboardArrowRight,
  KeyboardDoubleArrowRight,
} from '@mui/icons-material';
import {
  Breadcrumbs,
  Card,
  CardHeader,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';

export default function StockTransferCreate() {
  //#region Hooks

  const handleSnackbarAlert = useSnackbarService();

  //#endregion
  //#region Branch Data

  const [branch, setBranch] = useState<Branch | null>(null);

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
    async function fetchData() {
      if (!userData) {
        return;
      }
      getBranchByManager(userData).then((branch) => {
        if (branch) {
          setBranch(branch);
        }
      });
    }

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
  //#region Branch batches logics

  const batches = useBranchBatches(branch?.id);
  const tree = useProductTypeTree(batches);

  //#endregion

  console.log(tree);

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
          <Typography color="text.primary">Thêm lưu thông</Typography>
        </Breadcrumbs>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 4, height: 200 }}>
          <CardHeader
            title="Chi nhánh chuyến tới"
            titleTypographyProps={{
              variant: 'h6',
            }}
          />
          <Divider />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 4 }}>
          <CardHeader
            title="Danh sách lô bánh"
            titleTypographyProps={{
              variant: 'h6',
            }}
          />
          <Divider />
          <List>
            {tree.map((treeItem) => (
              <ProductTypeListItem key={treeItem.data.id} item={treeItem} />
            ))}
          </List>
        </Card>
      </Grid>
    </Grid>
  );
}

function ProductTypeListItem({ item }: { item: ProductTypeTree }) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <ListItemButton key={item.data.id} onClick={() => setOpen(!open)}>
        <ListItemText primary={item.data.name} />
        <KeyboardArrowDown
          sx={{
            mr: 2,
            transform: open ? 'rotate(-180deg)' : 'rotate(0)',
            transition: '0.2s',
          }}
        />
      </ListItemButton>
      <Collapse in={open}>
        <List>
          {item.children.map((treeItem) => (
            <ProductListItem key={treeItem.data.id} item={treeItem} />
          ))}
        </List>
      </Collapse>
    </>
  );
}
function ProductListItem({ item }: { item: ProductTree }) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <ListItemButton key={item.data.id} onClick={() => setOpen(!open)}>
        <ListItemIcon>
          <KeyboardArrowRight />
        </ListItemIcon>
        <ListItemText primary={item.data.name} />
        <KeyboardArrowDown
          sx={{
            mr: 2,
            transform: open ? 'rotate(-180deg)' : 'rotate(0)',
            transition: '0.2s',
          }}
        />
      </ListItemButton>
      <Collapse in={open}>
        <List>
          {item.children.map((treeItem) => (
            <VariantListItem key={treeItem.data.id} item={treeItem} />
          ))}
        </List>
      </Collapse>
    </>
  );
}
function VariantListItem({ item }: { item: VariantTree }) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <ListItemButton key={item.data.id} onClick={() => setOpen(!open)}>
        <ListItemIcon sx={{ ml: 1 }}>
          <KeyboardDoubleArrowRight />
        </ListItemIcon>
        <ListItemText primary={`${item.data.material} - ${item.data.size}`} />
        <KeyboardArrowDown
          sx={{
            mr: 2,
            transform: open ? 'rotate(-180deg)' : 'rotate(0)',
            transition: '0.2s',
          }}
        />
      </ListItemButton>
      <Collapse in={open}>
        <List>
          {item.children.map((treeItem) => (
            <BatchListItem key={treeItem.id} item={treeItem} />
          ))}
        </List>
      </Collapse>
    </>
  );
}
function BatchListItem({ item }: { item: Batch }) {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <ListItemButton>
        <ListItemIcon sx={{ ml: 2 }}>
          <Circle fontSize="small" />
        </ListItemIcon>
        {item.id}
      </ListItemButton>
    </>
  );
}

let cached: Batch[] | null = null;
function filterBranchBatches(
  branchId: string | undefined | null,
  batches: Batch[]
): Batch[] {
  return batches.filter((batch) => {
    if (!branchId) return true;
    return batch.branch_id === branchId;
  });
}
function useBranchBatches(branchId: string | undefined | null) {
  const [batches, setBatches] = useState<Batch[]>([]);
  useEffect(() => {
    async function fetchData() {
      if (!branchId) {
        setBatches([]);
        return;
      }
      if (!cached) {
        cached = await getBatches();
      }
      setBatches(filterBranchBatches(branchId, cached));
    }
    fetchData();
  }, [branchId]);
  return batches;
}

function useProductTypeTree(batches: Batch[]): Tree {
  const [tree, setTree] = useState<Tree>([]);

  useEffect(() => {
    const map: TreeMap = new Map();
    batches.forEach((batch) => {
      const { product_type_id, product_id, variant_id } = batch;
      ensureMap(map, product_type_id, product_id, variant_id);
      map.get(product_type_id)!.get(product_id)!.get(variant_id)!.push(batch);
    });
    mapTreeMapToTree(map).then(setTree);
  }, [batches]);

  return tree;
}

// This cache is for debug purpose only
// this save firebase request
const mappingCache = new Map<string, Tree>();
async function mapTreeMapToTree(map: TreeMap): Promise<Tree> {
  const tree: Tree = [];

  if (mappingCache.has(JSON.stringify(map))) {
    return mappingCache.get(JSON.stringify(map))!;
  }

  for (const [productTypeId, productTypeMap] of map) {
    const productType = await getProductTypeById(productTypeId);
    if (!productType) continue;
    const productTypeTree: ProductTypeTree = {
      data: productType,
      children: [],
    };

    for (const [productId, productMap] of productTypeMap) {
      const product = await getProduct(productTypeId, productId);
      if (!product) continue;
      const productTree: ProductTree = {
        data: product,
        children: [],
      };

      for (const [variantId, variantMap] of productMap) {
        const variant = await getVariant(productTypeId, productId, variantId);
        if (!variant) continue;
        const variantTree: VariantTree = {
          data: variant,
          children: variantMap,
        };
        productTree.children.push(variantTree);
      }
      productTypeTree.children.push(productTree);
    }

    tree.push(productTypeTree);
  }

  mappingCache.set(JSON.stringify(map), tree);

  return tree;
}
function ensureMap(
  map: TreeMap,
  product_type_id: string,
  product_id: string,
  variant_id: string
) {
  if (!map.has(product_type_id)) {
    map.set(product_type_id, new Map());
  }
  if (!map.get(product_type_id)?.has(product_id)) {
    map.get(product_type_id)?.set(product_id, new Map());
  }
  if (!map.get(product_type_id)?.get(product_id)?.has(variant_id)) {
    map.get(product_type_id)?.get(product_id)?.set(variant_id, []);
  }
}

type TreeMap = Map<string, ProductTypeTreeMap>;
type ProductTypeTreeMap = Map<string, ProductTreeMap>;
type ProductTreeMap = Map<string, VariantTreeMap>;
type VariantTreeMap = Batch[];

type Tree = ProductTypeTree[];
type ProductTypeTree = WithChildren<ProductType, ProductTree>;
type ProductTree = WithChildren<Product, VariantTree>;
type VariantTree = WithChildren<Variant, Batch>;

type WithChildren<TData, TChildren> = {
  data: TData;
  children: TChildren[];
};
