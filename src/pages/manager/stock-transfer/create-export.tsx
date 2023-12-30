import { auth } from '@/firebase/config';
import { getBatches } from '@/lib/DAO/batchDAO';
import { getBranchByManager } from '@/lib/DAO/branchDAO';
import { getProduct } from '@/lib/DAO/productDAO';
import { getProductTypeById } from '@/lib/DAO/productTypeDAO';
import { getUserByUid } from '@/lib/DAO/userDAO';
import { getVariant } from '@/lib/DAO/variantDAO';
import { useSnackbarService } from '@/lib/contexts';
import useBranches from '@/lib/hooks/useBranches';
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
  CardContent,
  CardHeader,
  Checkbox,
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
  Radio,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { onAuthStateChanged } from 'firebase/auth';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';

export default function CreateExport() {
  //#region Hooks

  const handleSnackbarAlert = useSnackbarService();

  //#endregion
  //#region Client Authorization & Branch Data

  const [branch, setBranch] = useState<Branch | null>(null);
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

  const tree = useProductTypeTree(branch?.id);

  //#endregion
  //#region Branch Selection

  const branches = useBranches();

  //#endregion
  //#region Batches selection

  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  function updateChecked(id: string, isChecked: boolean) {
    if (isChecked && !selectedBatches.includes(id)) {
      setSelectedBatches((selectedBatches) => [...selectedBatches, id]);
    } else if (!isChecked && selectedBatches.includes(id)) {
      setSelectedBatches((selectedBatches) =>
        selectedBatches.filter((id) => id !== id)
      );
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
          <Typography color="text.primary">Xuất lô bánh</Typography>
        </Breadcrumbs>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ borderRadius: 4 }}>
          <CardHeader
            title="Chi nhánh chuyến tới"
            titleTypographyProps={{
              variant: 'h6',
            }}
          />
          <Divider />
          <CardContent>
            <List>
              {branches.map((_branch) => {
                if (!branch || _branch.id === branch.id) {
                  return null;
                }
                return (
                  <BranchListItem key={_branch.id} item={_branch} selected />
                );
              })}
            </List>
          </CardContent>
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
          <CardContent sx={{ p: 0 }}>
            <List>
              <ListItem>
                <ListItemText
                  primary={`Đã chọn ${
                    selectedBatches.length
                  } lô bánh: ${selectedBatches
                    .map((batch) => batch)
                    .join(', ')}`}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            </List>
            <Divider />
            <List>
              {tree.map((treeItem) => (
                <ProductTypeListItem
                  key={treeItem.data.id}
                  item={treeItem}
                  checked={selectedBatches}
                  onCheckedChange={updateChecked}
                />
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

function BranchListItem({
  item,
  selected: checked = false,
}: {
  item: Branch;
  selected: boolean;
}) {
  return (
    <ListItem secondaryAction={<Radio checked={checked} />}>
      <ListItemText primary={item.name} secondary={item.address} />
    </ListItem>
  );
}

function ProductTypeListItem({
  item,
  checked,
  onCheckedChange,
}: {
  item: ProductTypeTree;
  checked?: string[];
  onCheckedChange?: CheckedChangeHandler;
}) {
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
            <ProductListItem
              key={treeItem.data.id}
              item={treeItem}
              checked={checked}
              onCheckedChange={onCheckedChange}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
}
function ProductListItem({
  item,
  checked,
  onCheckedChange,
}: {
  item: ProductTree;
  checked?: string[];
  onCheckedChange?: CheckedChangeHandler;
}) {
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
            <VariantListItem
              key={treeItem.data.id}
              item={treeItem}
              checked={checked}
              onCheckedChange={onCheckedChange}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
}
function VariantListItem({
  item,
  checked,
  onCheckedChange,
}: {
  item: VariantTree;
  checked?: string[];
  onCheckedChange?: CheckedChangeHandler;
}) {
  const [open, setOpen] = useState<boolean>(false);
  function isChecked(id: string) {
    if (!checked) return false;
    return checked.includes(id);
  }
  function updateChecked(id: string, isChecked: boolean) {
    onCheckedChange && onCheckedChange(id, isChecked);
  }

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
            <BatchListItem
              key={treeItem.id}
              item={treeItem}
              checked={isChecked(treeItem.id)}
              onChange={(isChecked) => updateChecked(treeItem.id, isChecked)}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
}

type BatchListItemProps = {
  item: Batch;
  checked?: boolean;
  onChange?: (value: boolean) => void;
};
function BatchListItem({
  item,
  checked = false,
  onChange,
}: BatchListItemProps) {
  function handleOnCheckedChange(
    e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) {
    onChange && onChange(checked);
  }
  function handleCheckedToggled() {
    onChange && onChange(!checked);
  }

  return (
    <>
      <ListItem
        secondaryAction={
          <Checkbox
            checked={checked}
            edge="end"
            onChange={handleOnCheckedChange}
            color="secondary"
            sx={{ mr: 1 }}
          />
        }
      >
        <ListItemButton onClick={handleCheckedToggled}>
          <ListItemIcon sx={{ ml: 2 }}>
            <Circle fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={item.id} />
          <ListItemText primary={`Số lượng: ${item.sold}/${item.quantity}`} />
          <ListItemText
            primary={`Hạn sử dụng: ${dayjs(item.discount.start_at).format(
              'HH:MM - DD/MM/YYYY'
            )}`}
            secondary={`Khuyến mãi: ${item.discount.percent}%`}
          />
        </ListItemButton>
      </ListItem>
    </>
  );
}

type CheckedChangeHandler = (id: string, isChecked: boolean) => void;

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

function useProductTypeTree(branchId: string | null | undefined): Tree {
  const [tree, setTree] = useState<Tree>([]);
  const batches = useBranchBatches(branchId);

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
