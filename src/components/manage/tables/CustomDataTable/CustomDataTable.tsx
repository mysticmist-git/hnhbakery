import { COLLECTION_NAME } from '@/lib/constants';
import { getCollection } from '@/lib/firestore';
import { statusTextResolver } from '@/lib/manage/manage';
import {
  BaseObject,
  ProductObject,
  ProductTypeObject,
  StorageBatchObject,
} from '@/lib/models';
import { DeleteRowHandler, ViewRowHandler } from '@/lib/types/manage';
import { formatPrice } from '@/lib/utils';
import { Delete, Visibility } from '@mui/icons-material';
import {
  Checkbox,
  LinearProgress,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridLogicOperator,
  GridRenderCellParams,
  GridRowModel,
  GridValueFormatterParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import CustomGridToolBar from './CustomGridToolBar';

//#region Types

type BatchState = 'ok' | 'soldout' | 'expired' | 'unknown';

//#endregion

//#region functions

const resolveState = (batch: StorageBatchObject): BatchState => {
  if (batch.soldQuantity >= batch.totalQuantity) return 'soldout';

  if (new Date(batch.EXP).getTime() < Date.now()) return 'expired';

  return 'ok';

  // return 'unknown';
};

//#endregion

function StatusCell(params: GridRenderCellParams) {
  const theme = useTheme();

  const isActive = params.value as boolean;
  const color = isActive
    ? theme.palette.success.main
    : theme.palette.error.main;

  return (
    <Typography sx={{ color }} variant="body2">
      {statusTextResolver(isActive)}
    </Typography>
  );
}

function ActionsCell(
  params: GridRowModel,
  handleViewRow: ViewRowHandler,
  handleDeleteRow: DeleteRowHandler
) {
  return [
    <GridActionsCellItem
      key={'view'}
      icon={<Visibility />}
      label="Xem"
      onClick={() => handleViewRow(params.id)}
    />,
    <GridActionsCellItem
      key="delete"
      icon={<Delete />}
      label="Xóa"
      onClick={() => handleDeleteRow(params.row)}
    />,
  ];
}

const CustomLinearProgres = styled(LinearProgress)(({ theme }) => ({
  [`& .MuiLinearProgress-bar`]: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

interface CustomDataTableProps {
  mainDocs: BaseObject[] | null;
  collectionName: string;
  handleViewRow: ViewRowHandler;
  handleDeleteRow: DeleteRowHandler;
}

export default memo(function CustomDataTable(props: CustomDataTableProps) {
  //#region Hooks

  const theme = useTheme();

  //#endregion

  //#region States

  const [productTypes, setProductTypes] = useState<ProductTypeObject[]>([]);

  const [products, setProducts] = useState<ProductObject[]>([]);

  //#endregion

  //#region useEffect

  useEffect(() => {
    async function fetchTypes() {
      let productTypes: ProductTypeObject[] = [];

      try {
        productTypes = await getCollection<ProductTypeObject>(
          COLLECTION_NAME.PRODUCT_TYPES
        );
      } catch (error) {
        console.log(error);
      }

      setProductTypes(() => productTypes);
    }

    async function fetchProducts() {
      let products: ProductObject[] = [];

      try {
        products = await getCollection<ProductObject>(COLLECTION_NAME.PRODUCTS);
      } catch (error) {
        console.log(error);
      }

      setProducts(() => products);
    }

    switch (props.collectionName) {
      case COLLECTION_NAME.PRODUCT_TYPES:
        break;
      case COLLECTION_NAME.PRODUCTS:
        fetchTypes();
        break;
      case COLLECTION_NAME.BATCHES:
        fetchTypes();
        fetchProducts();
        break;
      default:
        break;
    }
  }, [props.collectionName]);

  //#endregion

  //#region Functions

  const generateDatagridColumn = useCallback((): GridColDef[] => {
    switch (props.collectionName) {
      case COLLECTION_NAME.PRODUCT_TYPES:
        return [
          {
            field: 'index',
            headerName: 'STT',
            valueGetter: (params: GridValueGetterParams) => {
              return params.api.getRowIndexRelativeToVisibleRows(params.id) + 1;
            },
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            disableColumnMenu: true,
          },
          {
            field: 'name',
            headerName: 'Tên',
            width: 160,
            filterable: false,
            hideable: false,
          },
          {
            field: 'productCount',
            headerName: 'Sản phẩm',
            type: 'number',
            align: 'center',
            hideable: false,
          },
          {
            field: 'description',
            headerName: 'Mô tả',
            flex: 1,
            align: 'left',
            headerAlign: 'left',
            sortable: false,
            filterable: false,
            hideable: false,
          },
          {
            field: 'active',
            headerName: 'Trạng thái',
            headerAlign: 'center',
            type: 'boolean',
            align: 'center',
            renderCell: StatusCell,
            sortComparator: (a, b) => {
              return a - b;
            },
            hideable: false,
          },
          {
            field: 'actions',
            type: 'actions',
            headerName: 'Hành động',
            headerAlign: 'right',
            align: 'right',
            getActions: getActions,
            hideable: false,
          },
        ];
      case COLLECTION_NAME.PRODUCTS:
        return [
          {
            field: 'index',
            headerName: 'STT',
            valueGetter: (params: GridValueGetterParams) => {
              return params.api.getRowIndexRelativeToVisibleRows(params.id) + 1;
            },
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            disableColumnMenu: true,
          },
          {
            field: 'name',
            headerName: 'Tên',
            align: 'left',
            headerAlign: 'left',
            flex: 1,
            hideable: false,
          },
          {
            field: 'product_type_id',
            headerName: 'Loại',
            type: 'singleSelect',
            valueOptions: productTypes.map((type) => type.id ?? ''),
            getOptionLabel: (value) => {
              return productTypes?.find((i) => i.id === value)?.name ?? 'Không';
            },
            valueFormatter: (params: GridValueFormatterParams) => {
              console.log(params);

              const typeName = productTypes.find(
                (i) => i.id === params.value
              )?.name;

              return typeName ?? 'Không tìm thấy';
            },
            align: 'left',
            headerAlign: 'left',
            flex: 1,
            hideable: false,
          },
          {
            field: 'description',
            headerName: 'Mô tả',
            align: 'left',
            headerAlign: 'left',
            flex: 1,
            hideable: false,
          },
          {
            field: 'variantCount',
            type: 'number',
            headerName: 'Biến thể',
            align: 'left',
            headerAlign: 'left',
            hideable: false,
          },
          {
            field: 'active',
            headerName: 'Trạng thái',
            headerAlign: 'center',
            type: 'boolean',
            align: 'center',
            renderCell: StatusCell,
            sortComparator: (a, b) => {
              return a - b;
            },
            hideable: false,
          },
          {
            field: 'actions',
            type: 'actions',
            headerName: 'Hành động',
            headerAlign: 'right',
            align: 'right',
            getActions: getActions,
            hideable: false,
          },
        ];
      case COLLECTION_NAME.BATCHES:
        return [
          {
            field: 'index',
            headerName: 'STT',
            valueGetter: (params: GridValueGetterParams) => {
              return params.api.getRowIndexRelativeToVisibleRows(params.id) + 1;
            },
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            disableColumnMenu: true,
          },
          {
            field: 'id',
            headerName: 'Mã lô',
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            disableColumnMenu: true,
          },
          {
            field: 'product_id',
            headerName: 'Sản phẩm',
            align: 'left',
            headerAlign: 'left',
            type: 'singleSelect',
            valueOptions: products?.map((type) => type.id ?? ''),
            getOptionLabel(value) {
              return products?.find((i) => i.id === value)?.name ?? 'Không';
            },
            valueFormatter: (params: GridValueFormatterParams) => {
              const productName = products.find(
                (i) => i.id === params.value
              )?.name;

              return productName ?? 'Không tìm thấy';
            },
            flex: 1,
            hideable: false,
          },
          {
            field: 'product_type_id',
            headerName: 'Loại',
            align: 'left',
            headerAlign: 'left',
            type: 'singleSelect',
            valueOptions: productTypes?.map((type) => type.id ?? ''),
            getOptionLabel(value) {
              return productTypes?.find((i) => i.id === value)?.name ?? 'Không';
            },
            valueFormatter: (params: GridValueFormatterParams) => {
              if (!productTypes) return 'Không tìm thấy';

              const typeName = productTypes.find(
                (i) => i.id === params.value
              )?.name;

              return typeName ?? 'Không tìm thấy';
            },
            flex: 1,
            hideable: false,
          },
          {
            field: 'material',
            headerName: 'Vật liệu',
            align: 'left',
            headerAlign: 'left',
            hideable: false,
          },
          {
            field: 'size',
            headerName: 'Kích cỡ',
            headerAlign: 'left',
            align: 'left',
            hideable: false,
          },
          {
            field: 'price',
            type: 'number',
            headerName: 'Giá',
            headerAlign: 'left',
            align: 'left',
            valueFormatter: (params) => formatPrice(params.value),
            hideable: false,
          },
          {
            field: 'quantity',
            headerName: 'Số lượng',
            type: 'string',
            valueGetter: (params) => {
              const batch = params.row as StorageBatchObject;
              return `${batch.soldQuantity}/${batch.totalQuantity}`;
            },
          },
          {
            field: 'state',
            type: 'string',
            headerName: 'Tình trạng',
            headerAlign: 'left',
            align: 'left',
            hideable: false,
            valueGetter: (params): BatchState => {
              const state = resolveState(params.row);
              return state;
            },
            valueFormatter: (params) => {
              const state: BatchState = params.value;
              switch (state) {
                case 'ok':
                  return 'Hoạt động';
                case 'soldout':
                  return 'Hết hàng';
                case 'expired':
                  return 'Hết hạn';
                default:
                  return 'Đã có lỗi xảy ra';
              }
            },
            renderCell: (params) => {
              return (
                <span
                  style={{
                    color:
                      params.value === 'ok'
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                  }}
                >
                  {params.formattedValue}
                </span>
              );
            },
          },
          {
            field: 'actions',
            type: 'actions',
            headerName: 'Hành động',
            headerAlign: 'right',
            align: 'right',
            getActions: getActions,
            hideable: false,
          },
        ];
      default:
        return [];
    }

    //#region Functions

    function getActions(params: any) {
      return ActionsCell(params, props.handleViewRow, props.handleDeleteRow);
    }

    //#endregion
  }, [
    productTypes,
    products,
    props.collectionName,
    props.handleDeleteRow,
    props.handleViewRow,
    theme.palette.error.main,
    theme.palette.success.main,
  ]);

  //#endregion

  //#region useMemos

  const columns = useMemo(() => {
    return generateDatagridColumn();
  }, [generateDatagridColumn]);

  //#endregion

  return (
    <DataGrid
      rows={props.mainDocs ?? []}
      columnVisibilityModel={{
        id: false,
      }}
      loading={props.mainDocs === null}
      columns={columns}
      localeText={{
        toolbarFilters: 'Bộ lọc',
      }}
      pageSizeOptions={[15, 25]}
      autoHeight
      slots={{
        loadingOverlay: CustomLinearProgres,
        baseCheckbox: (props) => {
          return <Checkbox color="secondary" {...props} />;
        },
        toolbar: CustomGridToolBar,
      }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 500 },
        },
        baseButton: {
          sx: {
            color: theme.palette.common.black,
          },
        },
        filterPanel: {
          // Force usage of "And" operator
          logicOperators: [GridLogicOperator.And],
          // Display columns by ascending alphabetical order
          columnsSort: 'asc',
          filterFormProps: {
            // Customize inputs by passing props
            logicOperatorInputProps: {
              variant: 'outlined',
              size: 'small',
            },
            columnInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            operatorInputProps: {
              variant: 'outlined',
              size: 'small',
              sx: { mt: 'auto' },
            },
            valueInputProps: {
              InputComponentProps: {
                variant: 'outlined',
                size: 'small',
              },
            },
            deleteIconProps: {
              sx: {
                '& .MuiSvgIcon-root': { color: '#d32f2f' },
              },
            },
          },
          sx: {
            // Customize inputs using css selectors
            '& .MuiDataGrid-filterForm': { p: 2 },
            '& .MuiDataGrid-filterForm:nth-child(even)': {
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? '#444' : '#f5f5f5',
            },
            '& .MuiDataGrid-filterFormLogicOperatorInput': { mr: 2 },
            '& .MuiDataGrid-filterFormColumnInput': { mr: 2, width: 150 },
            '& .MuiDataGrid-filterFormOperatorInput': { mr: 2 },
            '& .MuiDataGrid-filterFormValueInput': { width: 200 },
          },
        },
      }}
    />
  );
});
